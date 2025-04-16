'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata } from 'next';
import './globals.css';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated, logout } from '@/lib/auth';
import Link from 'next/link';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

function NavButtons({
  isAuth,
  onLogout,
}: {
  isAuth: boolean;
  onLogout: () => void;
}) {
  if (isAuth) {
    return (
      <>
        <Button
          component={Link}
          href="/dashboard"
          color="inherit"
          sx={{
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '3.54%',
            textTransform: 'uppercase',
            py: '4px',
            px: '5px',
            mr: 1,
          }}
        >
          Dashboard
        </Button>
        <Button
          color="inherit"
          onClick={onLogout}
          sx={{
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '3.54%',
            textTransform: 'uppercase',
            py: '4px',
            px: '5px',
          }}
        >
          Logout
        </Button>
      </>
    );
  }

  return (
    <Button
      component={Link}
      href="/login"
      color="inherit"
      sx={{
        fontSize: '13px',
        fontWeight: 500,
        letterSpacing: '3.54%',
        textTransform: 'uppercase',
        py: '4px',
        px: '5px',
      }}
    >
      Login
    </Button>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsAuth(isAuthenticated());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    router.push('/login');
  };

  return (
    <html lang="en" className={roboto.variable}>
      <body style={{ margin: 0 }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 }}>
              <AppBar position="static" sx={{ bgcolor: '#536DFE' }}>
                <Toolbar sx={{ minHeight: '48px !important', px: '12px' }}>
                  <Typography
                    variant="h6"
                    component={Link}
                    href="/"
                    sx={{
                      flexGrow: 1,
                      fontSize: '20px',
                      fontWeight: 500,
                      letterSpacing: '0.75%',
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    JobSearch
                  </Typography>
                  {mounted && (
                    <NavButtons isAuth={isAuth} onLogout={handleLogout} />
                  )}
                </Toolbar>
              </AppBar>
            </Box>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
