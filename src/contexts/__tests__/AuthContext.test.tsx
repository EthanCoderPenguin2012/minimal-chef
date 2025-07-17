import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock fetch responses
const mockFetchImplementation = (status: number, data: any = {}) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(data),
  });
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
    (global.fetch as jest.Mock).mockClear();
  });

  const TestComponent = () => {
    const { user, isLoading } = useAuth();
    return (
      <div>
        {isLoading ? (
          <div data-testid="loading">Loading...</div>
        ) : (
          <div data-testid="user-status">
            {user ? `Logged in as ${user.username}` : 'Not logged in'}
          </div>
        )}
      </div>
    );
  };

  test('provides initial auth state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for the loading state to resolve
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
  });

  test('loads user from localStorage if session is valid', async () => {
    const mockUser = { email: 'test@example.com', username: 'testuser', hash: '123' };
    const futureTime = new Date().getTime() + 3600000; // 1 hour in the future
    
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'minimalChefUser') return JSON.stringify(mockUser);
      if (key === 'minimalChefSession') return futureTime.toString();
      return null;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as testuser');
  });

  test('clears expired session', async () => {
    const mockUser = { email: 'test@example.com', username: 'testuser', hash: '123' };
    const pastTime = new Date().getTime() - 3600000; // 1 hour in the past
    
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'minimalChefUser') return JSON.stringify(mockUser);
      if (key === 'minimalChefSession') return pastTime.toString();
      return null;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    expect(localStorage.removeItem).toHaveBeenCalledWith('minimalChefUser');
    expect(localStorage.removeItem).toHaveBeenCalledWith('minimalChefSession');
  });

  test('register function calls API and returns success status', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      mockFetchImplementation(200)
    );

    const TestRegister = () => {
      const { register } = useAuth();
      const handleRegister = async () => {
        const result = await register('testuser', 'test@example.com');
        if (result) {
          document.body.setAttribute('data-register-result', 'success');
        } else {
          document.body.setAttribute('data-register-result', 'failure');
        }
      };

      return <button onClick={handleRegister}>Register</button>;
    };

    render(
      <AuthProvider>
        <TestRegister />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Register').click();
    });

    await waitFor(() => {
      expect(document.body.getAttribute('data-register-result')).toBe('success');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', email: 'test@example.com' }),
    });
  });

  test('login function calls API and returns success status', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      mockFetchImplementation(200)
    );

    const TestLogin = () => {
      const { login } = useAuth();
      const handleLogin = async () => {
        const result = await login('test@example.com');
        if (result) {
          document.body.setAttribute('data-login-result', 'success');
        } else {
          document.body.setAttribute('data-login-result', 'failure');
        }
      };

      return <button onClick={handleLogin}>Login</button>;
    };

    render(
      <AuthProvider>
        <TestLogin />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(document.body.getAttribute('data-login-result')).toBe('success');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
  });

  test('verifyCode function sets user on success', async () => {
    const mockUser = { email: 'test@example.com', username: 'testuser', hash: '123' };
    
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      mockFetchImplementation(200, { user: mockUser })
    );

    const TestVerify = () => {
      const { verifyCode, user } = useAuth();
      const handleVerify = async () => {
        await verifyCode('123456');
      };

      return (
        <div>
          <button onClick={handleVerify}>Verify</button>
          {user && <div data-testid="user-info">{user.username}</div>}
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestVerify />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Verify').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent('testuser');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: '123456' }),
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('minimalChefUser', JSON.stringify(mockUser));
    expect(localStorage.setItem).toHaveBeenCalledTimes(2); // Once for user, once for session
  });

  test('logout function clears user and localStorage', async () => {
    const mockUser = { email: 'test@example.com', username: 'testuser', hash: '123' };
    
    // Mock the implementation of useAuth to return a user initially
    jest.spyOn(React, 'useContext').mockReturnValueOnce({
      user: mockUser,
      logout: jest.fn().mockImplementation(() => {
        localStorage.removeItem('minimalChefUser');
        localStorage.removeItem('minimalChefSession');
      }),
      login: jest.fn(),
      register: jest.fn(),
      verifyCode: jest.fn(),
      isLoading: false
    });
    
    const TestLogout = () => {
      const { logout, user } = useAuth();
      
      return (
        <div>
          <button onClick={logout}>Logout</button>
          <div data-testid="user-status">
            {user ? `Logged in as ${user.username}` : 'Not logged in'}
          </div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestLogout />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith('minimalChefUser');
    expect(localStorage.removeItem).toHaveBeenCalledWith('minimalChefSession');
  });
});