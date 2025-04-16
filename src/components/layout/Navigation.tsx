'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function NavButtons() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!mounted) return null;

  if (isAuthenticated) {
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
          onClick={handleLogout}
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

export function Navigation() {
  const { loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render buttons until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
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
              MBlog
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }

  return (
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
            MBlog
          </Typography>
          {!loading && <NavButtons />}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
