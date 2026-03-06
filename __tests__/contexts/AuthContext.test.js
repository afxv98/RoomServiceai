import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Component that consumes the context
function TestConsumer() {
  const { user, login, logout, loading } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? JSON.stringify(user) : 'null'}</span>
      <button onClick={() => login('test@example.com', 'admin')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Stub localStorage
let store = {};
const localStorageMock = {
  getItem: jest.fn((key) => store[key] ?? null),
  setItem: jest.fn((key, value) => { store[key] = String(value); }),
  removeItem: jest.fn((key) => { delete store[key]; }),
  clear: jest.fn(() => { store = {}; }),
};

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
});

beforeEach(() => {
  store = {};
  jest.clearAllMocks();
});

describe('AuthProvider', () => {
  it('renders children', () => {
    render(
      <AuthProvider>
        <div data-testid="child">hello</div>
      </AuthProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('starts with loading=true then resolves to false', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    // After mount + useEffect, loading should be false
    expect(screen.getByTestId('loading').textContent).toBe('false');
  });

  it('starts with user=null when localStorage is empty', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('restores user from localStorage on mount', () => {
    store['user'] = JSON.stringify({ email: 'stored@example.com', userType: 'hotel' });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('user').textContent).toContain('stored@example.com');
    expect(screen.getByTestId('user').textContent).toContain('hotel');
  });

  it('login saves user to localStorage and updates state', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({ email: 'test@example.com', userType: 'admin' })
    );
    expect(screen.getByTestId('user').textContent).toContain('test@example.com');
  });

  it('logout removes user from localStorage and clears state', async () => {
    store['user'] = JSON.stringify({ email: 'user@example.com', userType: 'admin' });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('user').textContent).toContain('user@example.com');

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    expect(screen.getByTestId('user').textContent).toBe('null');
  });
});

describe('useAuth', () => {
  it('throws when used outside AuthProvider', () => {
    const OriginalConsoleError = console.error;
    console.error = jest.fn(); // suppress React error boundary noise

    function BadConsumer() {
      useAuth();
      return null;
    }

    expect(() => render(<BadConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    console.error = OriginalConsoleError;
  });
});
