'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TreeDeciduous, Plus, List, Settings, Menu, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { TeamSelector } from '@/components/team/TeamSelector';
import { SyncStatus } from '@/components/sync/SyncStatus';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/', label: 'Assessments', icon: List },
  { href: '/assessment/new', label: 'New Assessment', icon: Plus },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, profile, signOut } = useAuth();

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

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <SyncStatus variant="compact" />
          <TeamSelector />
          {isAuthenticated && (
            <UserMenu
              displayName={profile?.display_name || profile?.email || 'User'}
              onSignOut={signOut}
            />
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden ml-auto flex items-center gap-2">
          <SyncStatus variant="compact" />
          <TeamSelector />
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

                {/* Mobile Sign Out */}
                {isAuthenticated && (
                  <>
                    <div className="border-t my-2" />
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-3 text-sm font-medium py-2 px-3 rounded-md transition-colors hover:bg-muted text-red-600"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

interface UserMenuProps {
  displayName: string;
  onSignOut: () => void;
}

function UserMenu({ displayName, onSignOut }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
            <User className="h-4 w-4 text-green-600" />
          </div>
          <span className="max-w-[100px] truncate hidden lg:inline">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onSignOut}
          className="gap-2 text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
