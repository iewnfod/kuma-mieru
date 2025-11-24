'use client';

import type { SiteConfig } from '@/types/config';
import { Link } from '@heroui/react';

import packageJson from '@/package.json';

interface FooterProps {
  config: SiteConfig;
}

export function Footer({ config }: FooterProps) {
  const { footerText, showPoweredBy } = config;

  return (
    <footer className="w-full flex flex-col items-center justify-center py-4 px-4 mt-4 text-sm text-foreground-500 relative z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-2 md:mb-0 text-base">{footerText}</div>

    </footer>
  );
}
