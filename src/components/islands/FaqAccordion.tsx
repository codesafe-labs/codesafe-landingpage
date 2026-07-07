import { useRef, useState, type FormEvent } from 'react';

export default function FaqAccordion({
	items,
}: {
	items: { q: string; a: string }[];
}) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<div className="mt-10 flex flex-col gap-2.5">
			{items.map((faq, i) => {
				const isOpen = openIndex === i;
				const panelId = `faq-panel-${i}`;
				const triggerId = `faq-trigger-${i}`;

				return (
					<div
						key={i}
						className="overflow-hidden border border-crt-border bg-crt-surface"
					>
						<button
							id={triggerId}
							type="button"
							aria-expanded={isOpen}
							aria-controls={panelId}
							onClick={() => setOpenIndex(isOpen ? null : i)}
							className="flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent px-5 py-4 text-left text-[13.5px] font-semibold text-crt-cream touch-action-manipulation focus-visible:outline-2 focus-visible:outline-crt-amber focus-visible:outline-offset-[-2px]"
						>
							{faq.q}
							<span className="shrink-0 text-[15px] text-crt-amber" aria-hidden="true">
								{isOpen ? '−' : '+'}
							</span>
						</button>
						{isOpen && (
							<p
								id={panelId}
								role="region"
								aria-labelledby={triggerId}
								className="m-0 px-5 pb-[18px] text-[12.5px] leading-[1.8] text-crt-body text-pretty"
							>
								{faq.a}
							</p>
						)}
					</div>
				);
			})}
		</div>
	);
}
