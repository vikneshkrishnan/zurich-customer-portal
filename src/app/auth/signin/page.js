'use client';
import React from 'react';
import { signIn } from 'next-auth/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Box, Button, Card, Typography, TextField, Grid } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export default function SignIn() {
  return (
    <>
      <Box sx={styles.pageContainer}>
        <Header title="Zurich Customer Portal" />

        <Box sx={styles.contentContainer}>
          <Card sx={styles.card}>
            <Typography variant="h5" sx={styles.title}>
              Sign In
            </Typography>

            <Grid container spacing={2} sx={styles.formContainer}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  value="example@example.com" 
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  value="password" 
                  disabled
                  fullWidth
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              startIcon={<GoogleIcon />}
              sx={styles.googleButton}
              onClick={() => signIn('google', { callbackUrl: '/dashboard' }).catch(() => router.push('/auth/error'))}
              >
              Sign in with Google
            </Button>
          </Card>
        </Box>
        <Footer />
      </Box>
    </>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    overflow: 'hidden', 
  },
  contentContainer: {
    flex: '1 1 auto', 
    overflowY: 'auto', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: '20px',
    backgroundImage: `url('/customer.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center', 
    backgroundRepeat: 'no-repeat', 
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: '20px',
    color: '#23366f',
    fontWeight: 600,
  },
  formContainer: {
    marginBottom: '20px',
  },
  googleButton: {
    backgroundColor: '#4285f4',
    color: '#fff',
    fontSize: '16px',
    padding: '10px 20px',
    borderRadius: '4px',
    fontWeight: 500,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#357ae8',
    },
    width: '100%',
    justifyContent: 'center',
  },
};
