import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex-grow flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center">
        <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
          <span className="material-symbols-outlined text-6xl">search_off</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-600 dark:text-slate-400 mb-6">
          Page Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-blue-600 text-white text-base font-bold transition-all shadow-lg shadow-primary/25"
          >
            Go Home
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-lg h-12 px-6 bg-transparent border border-gray-300 dark:border-gray-600 hover:border-primary text-slate-900 dark:text-white text-base font-bold transition-all"
          >
            View Projects
          </Link>
        </div>
      </div>
    </main>
  );
}
