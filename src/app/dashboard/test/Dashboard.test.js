import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardPage from '../page';
import { store } from '../../redux/store';
import { fetchUsers } from '../../redux/userSlice';
import { configureStore } from '@reduxjs/toolkit'; // <-- Import configureStore

// Mock necessary dependencies
jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../../redux/userSlice', () => ({
  fetchUsers: jest.fn(),
}));

describe('DashboardPage Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Mock the useRouter
    useRouter.mockReturnValue({
      push: mockPush,
    });

    // Mock useSession
    useSession.mockReturnValue({
      data: { user: { name: 'John Doe', email: 'john@example.com' } },
      status: 'authenticated',
    });

    // Reset fetchUsers mock
    fetchUsers.mockReturnValue({
      type: 'users/fetchUsers',
      payload: { data: [], total_pages: 1 },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders DashboardPage and fetches users', () => {
    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );

    // Check if title is rendered
    const title = screen.getByText(/Customer Listing Page/i);
    expect(title).toBeInTheDocument();

    // Check if search fields are rendered
    expect(screen.getByLabelText(/Search by First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Search by Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Search by Email/i)).toBeInTheDocument();

    // Check if the fetchUsers action was called
    expect(fetchUsers).toHaveBeenCalled();
  });

  test('redirects unauthenticated users', () => {
    useSession.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );

    // Check if the user is redirected to the signin page
    expect(mockPush).toHaveBeenCalledWith('/auth/signin');
  });

  test('filters users based on search input', () => {
    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );

    const firstNameInput = screen.getByLabelText(/Search by First Name/i);
    const lastNameInput = screen.getByLabelText(/Search by Last Name/i);
    const emailInput = screen.getByLabelText(/Search by Email/i);

    // Simulate user typing in search fields
    fireEvent.change(firstNameInput, { target: { value: 'G' } });
    fireEvent.change(lastNameInput, { target: { value: 'W' } });
    fireEvent.change(emailInput, { target: { value: 'example' } });

    // Check if the inputs have the correct value
    expect(firstNameInput.value).toBe('G');
    expect(lastNameInput.value).toBe('W');
    expect(emailInput.value).toBe('example');
  });

  test('clears search fields on Clear button click', () => {
    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );

    const firstNameInput = screen.getByLabelText(/Search by First Name/i);
    const lastNameInput = screen.getByLabelText(/Search by Last Name/i);
    const emailInput = screen.getByLabelText(/Search by Email/i);

    fireEvent.change(firstNameInput, { target: { value: 'G' } });
    fireEvent.change(lastNameInput, { target: { value: 'W' } });
    fireEvent.change(emailInput, { target: { value: 'example' } });

    const clearButton = screen.getByText(/Clear/i);
    fireEvent.click(clearButton);

    expect(firstNameInput.value).toBe('');
    expect(lastNameInput.value).toBe('');
    expect(emailInput.value).toBe('');
  });

  test('displays loading state when fetching users', () => {
    fetchUsers.mockReturnValueOnce({
      type: 'users/fetchUsers/pending',
    });

    const initialState = {
      users: {
        data: [],
        page: 1,
        totalPages: 0,
        loading: true,
      },
    };

    const customStore = configureStore({
      reducer: {
        users: (state = initialState.users) => state,
      },
    });

    render(
      <Provider store={customStore}>
        <DashboardPage />
      </Provider>
    );

    const loadingElement = screen.getByTestId('loading-indicator');
    expect(loadingElement).toHaveTextContent(/Loading.../i);
  });
});
