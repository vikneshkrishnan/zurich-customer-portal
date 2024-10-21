import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardPage from '../page';
import { store } from '../../redux/store';
import { fetchUsers } from '../../redux/userSlice';
import { configureStore } from '@reduxjs/toolkit'; 

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
    useRouter.mockReturnValue({
      push: mockPush,
    });

    useSession.mockReturnValue({
      data: { user: { name: 'John Doe', email: 'john@example.com' } },
      status: 'authenticated',
    });

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

    const title = screen.getByText(/Customer Listing Page/i);
    expect(title).toBeInTheDocument();

    expect(screen.getByLabelText(/Search by First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Search by Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Search by Email/i)).toBeInTheDocument();

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

    fireEvent.change(firstNameInput, { target: { value: 'G' } });
    fireEvent.change(lastNameInput, { target: { value: 'W' } });
    fireEvent.change(emailInput, { target: { value: 'example' } });

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
