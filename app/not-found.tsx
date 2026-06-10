import Link from 'next/link';
import { Button, Eyebrow } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-xl text-center">
        <Eyebrow>Error 404</Eyebrow>
        <h1 className="mt-4 font-display text-[clamp(72px,16vw,180px)] font-extrabold uppercase leading-[.86] tracking-[-.03em] text-ink">
          4<span className="text-outline">0</span>4
        </h1>
        <h2 className="mt-2 font-display text-[clamp(24px,3.6vw,42px)] font-bold uppercase leading-none tracking-[-.02em] text-ink">
          Page Not Found
          <span className="text-accent">.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
          <Link href="/projects">
            <Button variant="ghost">View Projects</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
