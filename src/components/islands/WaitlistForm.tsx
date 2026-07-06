import { useState, type FormEvent } from 'react';

export default function WaitlistForm() {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
	const [errorMsg, setErrorMsg] = useState('');

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setStatus('idle');
		setErrorMsg('');

		try {
			const res = await fetch('/api/waitlist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});
			const data = await res.json();

			if (!res.ok) {
				setStatus('error');
				setErrorMsg(data.error ?? 'Something went wrong');
				return;
			}

			setStatus('success');
		} catch {
			setStatus('error');
			setErrorMsg('Network error. Please try again.');
		}
	}

	if (status === 'success') {
		return (
			<div className="mt-2 flex items-center gap-2.5 rounded-[10px] border border-green-border bg-green-pale px-5 py-[13px] text-[15px] font-semibold text-green-dark">
				✓ You're on the list. We'll be in touch.
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="mt-2 flex w-full max-w-[440px] gap-2.5"
		>
			<input
				type="email"
				required
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="you@yourapp.com"
				className="flex-1 rounded-[10px] border border-[#DDE1DB] bg-white px-4 py-[13px] font-sans text-[15px] text-ink outline-none focus:border-green"
			/>
			<button
				type="submit"
				className="cursor-pointer rounded-[10px] border-none bg-green px-5 py-[13px] font-sans text-[15px] font-semibold text-cream hover:bg-green-hover"
			>
				Join waitlist
			</button>
			{status === 'error' && (
				<p className="absolute mt-16 text-sm text-red-600">{errorMsg}</p>
			)}
		</form>
	);
}
