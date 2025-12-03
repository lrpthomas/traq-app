'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TreeDeciduous, Plus, List, Settings, Menu } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Assessments', icon: List },
  { href: '/assessment/new', label: 'New Assessment', icon: Plus },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-6">
          <TreeDeciduous className="h-6 w-6 text-green-600" />
          <span className="font-bold text-lg hidden sm:inline">TRAQ</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground/80',
                  isActive ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Offline Indicator */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <OfflineIndicator />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden ml-auto flex items-center gap-2">
          <OfflineIndicator />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 text-sm font-medium py-2 px-3 rounded-md transition-colors',
                        isActive
                          ? 'bg-green-100 text-green-800'
                          : 'hover:bg-muted'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function subscribeToOnlineStatus(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineStatus() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Assume online during SSR
}

function OfflineIndicator() {
  const isOnline = useSyncExternalStore(
    subscribeToOnlineStatus,
    getOnlineStatus,
    getServerSnapshot
  );

  if (isOnline) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
      <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
      Offline
    </div>
  );
}
