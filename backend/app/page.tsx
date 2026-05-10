export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)] bg-slate-950 text-white">
            <main className="flex flex-col gap-4 items-center">
                <h1 className="text-4xl font-bold tracking-tight">Ragra-Prep Backend</h1>
                <p className="text-slate-400 text-lg">The API service is running.</p>
                <div className="mt-8 p-4 bg-slate-900 border border-slate-800 rounded-lg">
                    <code className="text-emerald-400">/api/*</code>
                </div>
            </main>
        </div>
    );
}
