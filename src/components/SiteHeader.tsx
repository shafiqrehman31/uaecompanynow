import { useState } from 'react';
import { Menu, MessageCircle, X } from 'lucide-react';
import type { NavMenuItem } from '../types/domain';

interface SiteHeaderProps {
  currentSlug: string;
  navItems: NavMenuItem[];
  onNavigate: (slug: string) => void;
  whatsappNumber: string;
  logoDataUrl?: string;
  siteName?: string;
}

export function SiteHeader({
  currentSlug,
  navItems,
  onNavigate,
  whatsappNumber,
  logoDataUrl,
  siteName,
}: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const brandName = siteName?.trim() || 'Meridian Setup';
  const cleanWaDigits = whatsappNumber.replace(/[^\d]/g, '');
  const visibleItems = navItems
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);

  function handleNavClick(slug: string) {
    onNavigate(slug);
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-[0_4px_24px_-10px_rgba(15,41,74,0.09)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark / Uploaded Logo */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 font-display text-lg font-extrabold tracking-tight text-[#0F294A]"
        >
          {logoDataUrl ? (
            <img
              src={logoDataUrl}
              alt={brandName}
              className="h-9 w-auto max-w-[170px] object-contain"
            />
          ) : (
            <>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="28" height="28" rx="7" fill="#0F294A" />
                <path
                  d="M7 20V9L14 14L21 9V20"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{brandName}</span>
            </>
          )}
        </button>

        {/* Zone 2: Dynamic Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex"
        >
          {visibleItems.map((item) => {
            const active = currentSlug === item.slug;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.slug)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-[#0F294A] ${
                  active ? 'text-[#0F294A]' : 'text-slate-600'
                }`}
              >
                <span>{item.label}</span>
                {active && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[#2563EB]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={`https://wa.me/${cleanWaDigits}?text=${encodeURIComponent(
              'Hello Meridian Setup, I would like a Dubai company formation consultation.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#10B981] px-4 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#059669] whitespace-nowrap shrink-0"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp Advisor</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-[#0F294A] md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col space-y-1">
            {visibleItems.map((item) => {
              const active = currentSlug === item.slug;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.slug)}
                  className={`flex min-h-[44px] items-center justify-between rounded-xl px-3.5 text-left text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-[#0F294A] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
