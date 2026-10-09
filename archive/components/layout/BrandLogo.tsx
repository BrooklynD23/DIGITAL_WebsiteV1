import Image from 'next/image';
import { siteConfig } from '@/lib/data/siteConfig';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: number;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  variant = 'light',
  size = 20,
  className,
  priority = false,
}: BrandLogoProps) {
  const src = variant === 'dark' ? siteConfig.assets.logoDark : siteConfig.assets.logo;

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      priority={priority}
      className={cn('shrink-0 object-contain', className)}
      aria-hidden
    />
  );
}
