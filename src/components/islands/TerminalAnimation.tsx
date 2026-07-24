import { useCallback, useEffect, useRef, useState } from 'react';
import type { TerminalSegment } from '../../data/landing';

type Props = {
	lines: TerminalSegment[][];
};

const INTERVAL_MS = 420;

export default function TerminalAnimation({ lines }: Props) {
	const [shown, setShown] = useState(0);
	const [reducedMotion, setReducedMotion] = useState(false);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		setReducedMotion(mq.matches);
		const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	}, []);

	const startTerminal = useCallback(() => {
		if (timerRef.current) clearInterval(timerRef.current);

		if (reducedMotion) {
			setShown(lines.length);
			return;
		}

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
		}, INTERVAL_MS);
	}, [lines.length, reducedMotion]);

	useEffect(() => {
		startTerminal();
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [startTerminal]);

	const visibleLines = reducedMotion ? lines : lines.slice(0, shown);

	return (
		<div className="animate-cs-rise-delayed">
			<div
				role="button"
				tabIndex={0}
				aria-label="Replay terminal animation"
				onClick={startTerminal}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						startTerminal();
					}
				}}
				className="cursor-pointer overflow-hidden border border-crt-border-strong bg-crt-surface shadow-[0_0_60px_rgba(245,166,35,0.07)_inset,0_24px_60px_-30px_rgba(0,0,0,0.8)] touch-action-manipulation focus-visible:outline-2 focus-visible:outline-crt-amber focus-visible:outline-offset-2"
			>
				<div className="flex items-center justify-between border-b border-dashed border-crt-border px-[18px] py-[11px] text-[11px] text-crt-muted">
					<span>SECURITY AUDIT my-vibe-app</span>
					<span>codesafe-sh</span>
				</div>
				<div className="flex min-h-[340px] flex-col px-5 pb-[22px] pt-[18px] text-[12.5px] leading-[1.95]">
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
						<span
							className={`inline-block h-[15px] w-[9px] bg-crt-amber ${reducedMotion ? '' : 'animate-cs-blink'}`}
						/>
					</div>
				</div>
			</div>
			<p className="mt-3 text-center text-[11px] tracking-[0.08em] text-crt-faint">
				[ CLICK TERMINAL TO REPLAY ]
			</p>
		</div>
	);
}
