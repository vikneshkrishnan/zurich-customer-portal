import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import SignIn from '../signin/page';
import { signIn } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(() => Promise.resolve()),
}));

describe('SignIn Component', () => {
  it('renders Sign In page with correct title and button', () => {
    render(<SignIn />);

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('calls signIn when "Sign in with Google" button is clicked', async () => {
    render(<SignIn />);

    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));

    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/dashboard' });
  });
});
