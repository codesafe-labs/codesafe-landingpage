import { useState, type FormEvent } from 'react';

export default function SubscribeForm() {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
	const [errorMsg, setErrorMsg] = useState('');

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setStatus('idle');
		setErrorMsg('');

		try {
			const res = await fetch('/api/subscribe', {
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
			<div className="flex items-center gap-2.5 rounded-[10px] border border-green-border bg-white px-[18px] py-3 text-[14.5px] font-semibold text-green-dark">
				✓ Subscribed. See you next release.
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<form onSubmit={handleSubmit} className="flex gap-2.5">
				<input
					type="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@yourapp.com"
					className="min-w-[220px] rounded-[10px] border border-green-border bg-white px-[15px] py-3 font-sans text-[14.5px] text-ink outline-none focus:border-green"
				/>
				<button
					type="submit"
					className="cursor-pointer rounded-[10px] border-none bg-green px-[18px] py-3 font-sans text-[14.5px] font-semibold text-cream hover:bg-green-hover"
				>
					Subscribe
				</button>
			</form>
			{status === 'error' && (
				<p className="m-0 text-sm text-red-600">{errorMsg}</p>
			)}
		</div>
	);
}
