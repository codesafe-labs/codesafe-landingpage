import { useRef, useState, type FormEvent } from 'react';

function isValidEmail(value: string) {
	return value.length > 3 && value.includes('@') && value.includes('.');
}

export default function SubscribeForm() {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
		'idle',
	);
	const [errorMsg, setErrorMsg] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setErrorMsg('');

		if (!isValidEmail(email.trim())) {
			setStatus('error');
			setErrorMsg('Enter a valid email address');
			inputRef.current?.focus();
			return;
		}

		setStatus('loading');

		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: email.trim() }),
			});
			const data = await res.json();

			if (!res.ok) {
				setStatus('error');
				setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
				inputRef.current?.focus();
				return;
			}

			setStatus('success');
		} catch {
			setStatus('error');
			setErrorMsg('Network error. Please try again.');
			inputRef.current?.focus();
		}
	}

	if (status === 'success') {
		return (
			<div
				role="status"
				aria-live="polite"
				className="break-all border border-crt-green px-[18px] py-3 text-[14.5px] font-semibold text-crt-green"
			>
				✓ Subscribed. See you next release.
			</div>
		);
	}

	return (
		<div className="flex min-w-0 flex-col gap-2">
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-2 sm:flex-row sm:items-start"
				noValidate
			>
				<div className="flex min-w-0 flex-col gap-1.5">
					<label htmlFor="subscribe-email" className="sr-only">
						Email address
					</label>
					<input
						ref={inputRef}
						id="subscribe-email"
						name="email"
						type="email"
						inputMode="email"
						autoComplete="email"
						spellCheck={false}
						required
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							if (status === 'error') setStatus('idle');
						}}
						placeholder="you@yourapp.com…"
						aria-invalid={status === 'error'}
						aria-describedby={status === 'error' ? 'subscribe-error' : undefined}
						className="crt-input min-w-[220px]"
					/>
					{status === 'error' && (
						<p
							id="subscribe-error"
							role="alert"
							aria-live="polite"
							className="m-0 text-xs text-crt-red"
						>
							{errorMsg}
						</p>
					)}
				</div>
				<button
					type="submit"
					disabled={status === 'loading'}
					className="crt-btn-primary shrink-0 text-[14.5px] disabled:cursor-not-allowed disabled:opacity-70"
				>
					{status === 'loading' ? 'Subscribing…' : 'Subscribe'}
				</button>
			</form>
		</div>
	);
}
