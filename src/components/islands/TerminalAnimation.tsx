import { useCallback, useEffect, useRef, useState } from 'react';
import type { TerminalSegment } from '../../data/landing';

type Props = {
	lines: TerminalSegment[][];
};

export default function TerminalAnimation({ lines }: Props) {
	const [shown, setShown] = useState(0);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const startTerminal = useCallback(() => {
		if (timerRef.current) clearInterval(timerRef.current);
		setShown(0);
		timerRef.current = setInterval(() => {
			setShown((prev) => {
				if (prev >= lines.length) {
					if (timerRef.current) clearInterval(timerRef.current);
					timerRef.current = null;
					return prev;
				}
				return prev + 1;
			});
		}, 420);
	}, [lines.length]);

	useEffect(() => {
		startTerminal();
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [startTerminal]);

	const visibleLines = lines.slice(0, shown);

	return (
		<div className="animate-cs-rise-delayed">
			<div
				role="button"
				tabIndex={0}
				onClick={startTerminal}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') startTerminal();
				}}
				className="cursor-pointer overflow-hidden rounded-[14px] border border-terminal-border bg-terminal-bg shadow-[0_24px_60px_-24px_rgba(16,32,24,0.45)]"
			>
				<div className="flex items-center gap-2 border-b border-terminal-bar px-4 py-3">
					<span className="h-[11px] w-[11px] rounded-full bg-[#3A4A40]" />
					<span className="h-[11px] w-[11px] rounded-full bg-[#3A4A40]" />
					<span className="h-[11px] w-[11px] rounded-full bg-[#3A4A40]" />
					<span className="ml-auto font-mono text-[11.5px] text-[#5E6E64]">
						~/my-vibe-app
					</span>
				</div>
				<div className="flex min-h-[336px] flex-col px-5 pb-[22px] pt-[18px] font-mono text-[13px] leading-[1.75]">
					{visibleLines.map((line, i) => (
						<div key={i} className="flex whitespace-pre">
							{line.map((seg, j) => (
								<span key={j} style={{ color: seg.c }} className="whitespace-pre">
									{seg.t}
								</span>
							))}
						</div>
					))}
					<div className="flex">
						<span className="inline-block h-4 w-2 animate-cs-blink bg-green-light" />
					</div>
				</div>
			</div>
			<p className="mt-3 text-center text-xs font-medium text-faint">
				Click terminal to replay
			</p>
		</div>
	);
}
