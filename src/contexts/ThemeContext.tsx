'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { db, initializeSettings } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [initialized, setInitialized] = useState(false);

  // Initialize settings once (write operation)
  useEffect(() => {
    initializeSettings().then(() => {
      setInitialized(true);
    });
  }, []);

  // Load theme from settings (read-only query)
  const settings = useLiveQuery(
    async () => {
      if (!initialized) return null;
      // Read-only query - just get the settings
      return await db.settings.get('default');
    },
    [initialized]
  );

  const theme = (settings?.theme as Theme) || 'system';

  // Detect system theme and track mount state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- valid mount detection pattern
    setMounted(true);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Calculate resolved theme
  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme, mounted]);

  const setTheme = async (newTheme: Theme) => {
    if (settings) {
      await db.settings.put({ ...settings, theme: newTheme });
    }
  };

  // Prevent flash during hydration
  if (!mounted) {
    return (
      <>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (systemDark) document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
        {children}
      </>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Default values for SSR/SSG when ThemeProvider is not available
const defaultThemeContext: ThemeContextType = {
  theme: 'system',
  setTheme: async () => {},
  resolvedTheme: 'light',
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  // Return defaults during SSG/SSR, actual values after hydration
  return context || defaultThemeContext;
}
