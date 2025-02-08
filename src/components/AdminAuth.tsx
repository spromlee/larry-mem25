"use client";

import { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminAuth() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456789') {
      // Set authentication cookie
      Cookies.set('admin_authenticated', 'true', { path: '/' });
      router.push('/admin/dashboard');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <Container maxWidth="sm" className='min-h-[90vh] min-w-[300px] flex justify-center items-center'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        className='w-full shadow-md border-t-4 border-primary p-6 rounded-lg'
      >
        <Typography component="h1" variant="h5" className="!mb-6 text-primary !font-roboto-condensed">
          Admin Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="w-full">
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            className="!bg-primary !hover:bg-primaryLight !px-6 !py-2 !rounded-lg"
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
