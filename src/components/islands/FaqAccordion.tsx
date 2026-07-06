import { useState } from 'react';

type FaqItem = { q: string; a: string };

type Props = {
	items: FaqItem[];
};

export default function FaqAccordion({ items }: Props) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<div className="mt-11 flex flex-col gap-3">
			{items.map((faq, i) => {
				const isOpen = openIndex === i;
				return (
					<div
						key={i}
						className="overflow-hidden rounded-xl border border-border bg-cream"
					>
						<button
							type="button"
							onClick={() => setOpenIndex(isOpen ? null : i)}
							className="flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent px-[22px] py-[18px] text-left font-sans text-base font-semibold text-ink"
						>
							{faq.q}
							<span className="shrink-0 font-mono text-base text-green">
								{isOpen ? '−' : '+'}
							</span>
						</button>
						{isOpen && (
							<p className="m-0 px-[22px] pb-5 text-[15px] leading-[1.65] text-muted text-pretty">
								{faq.a}
							</p>
						)}
					</div>
				);
			})}
		</div>
	);
}
