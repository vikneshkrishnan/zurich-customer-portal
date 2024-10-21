'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Box, Button, Typography, Card } from '@mui/material';

export default function ErrorPage() {
  const router = useRouter();

  return (
    <>
      <Box sx={styles.pageContainer}>
        <Header/>
        <Box sx={styles.contentContainer}>
          <Card sx={styles.card}>
            <Typography variant="h5" sx={styles.title}>
              Authentication Failed
            </Typography>
            <Typography sx={styles.message}>
              We encountered an issue during your sign-in attempt. Please try again.
            </Typography>

            <Button
              variant="contained"
              sx={styles.retryButton}
              onClick={() => router.push('/auth/signin')}
            >
              Retry Sign In
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
    color: '#d32f2f',
    fontWeight: 600,
  },
  message: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '30px',
  },
  retryButton: {
    backgroundColor: '#23366f',
    color: '#fff',
    fontSize: '16px',
    padding: '10px 20px',
    borderRadius: '4px',
    fontWeight: 500,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#1e2b54',
    },
    width: '100%',
    justifyContent: 'center',
  },
};
