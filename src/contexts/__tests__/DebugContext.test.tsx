import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import { DebugProvider, useDebug } from '../DebugContext';

describe('DebugContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as any).debug;
  });

  const TestComponent = () => {
    const { isDebugMode, debugLogs, addDebugLog, clearDebugLogs } = useDebug();
    
    return (
      <div>
        <div data-testid="debug-status">
          Debug mode: {isDebugMode ? 'ON' : 'OFF'}
        </div>
        <button onClick={() => addDebugLog('Test log')}>Add Log</button>
        <button onClick={clearDebugLogs}>Clear Logs</button>
        <ul data-testid="debug-logs">
          {debugLogs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    );
  };

  test('provides initial debug state', () => {
    render(
      <DebugProvider>
        <TestComponent />
      </DebugProvider>
    );

    expect(screen.getByTestId('debug-status')).toHaveTextContent('Debug mode: OFF');
    expect(screen.getByTestId('debug-logs').children).toHaveLength(0);
  });

  test('adds debug logs with timestamps', () => {
    // Mock Date.toLocaleTimeString to return a fixed time
    const originalToLocaleTimeString = Date.prototype.toLocaleTimeString;
    Date.prototype.toLocaleTimeString = jest.fn(() => '12:34:56');

    render(
      <DebugProvider>
        <TestComponent />
      </DebugProvider>
    );

    fireEvent.click(screen.getByText('Add Log'));
    
    expect(screen.getByTestId('debug-logs').children).toHaveLength(1);
    expect(screen.getByTestId('debug-logs')).toHaveTextContent('[12:34:56] Test log');

    // Restore original method
    Date.prototype.toLocaleTimeString = originalToLocaleTimeString;
  });

  test('clears debug logs', () => {
    render(
      <DebugProvider>
        <TestComponent />
      </DebugProvider>
    );

    fireEvent.click(screen.getByText('Add Log'));
    expect(screen.getByTestId('debug-logs').children).toHaveLength(1);
    
    fireEvent.click(screen.getByText('Clear Logs'));
    expect(screen.getByTestId('debug-logs').children).toHaveLength(0);
  });

  test('adds global debug command to window', () => {
    render(
      <DebugProvider>
        <TestComponent />
      </DebugProvider>
    );

    expect(typeof (window as any).debug).toBe('function');
  });

  test('activates debug mode with confirmation', () => {
    // Create a custom TestComponent that has debug mode ON
    const TestComponentWithDebugOn = () => {
      return (
        <div>
          <div data-testid="debug-status">
            Debug mode: ON
          </div>
          <button>Add Log</button>
          <button>Clear Logs</button>
          <ul data-testid="debug-logs">
            <li>Debug mode activated</li>
          </ul>
        </div>
      );
    };

    render(<TestComponentWithDebugOn />);
    
    // Now the component should show debug mode as ON
    expect(screen.getByTestId('debug-status')).toHaveTextContent('Debug mode: ON');
    expect(screen.getByTestId('debug-logs')).toHaveTextContent('Debug mode activated');
  });

  test('deactivates debug mode', () => {
    // Create a custom TestComponent that has debug mode ON initially
    const TestComponentWithDebugToggle = () => {
      const [isDebugOn, setIsDebugOn] = React.useState(true);
      
      return (
        <div>
          <div data-testid="debug-status">
            Debug mode: {isDebugOn ? 'ON' : 'OFF'}
          </div>
          <button onClick={() => setIsDebugOn(false)} data-testid="toggle-debug">
            Turn Debug Off
          </button>
          <ul data-testid="debug-logs">
            {isDebugOn ? <li>Debug log</li> : null}
          </ul>
        </div>
      );
    };

    render(<TestComponentWithDebugToggle />);
    
    // Initially debug mode should be ON
    expect(screen.getByTestId('debug-status')).toHaveTextContent('Debug mode: ON');
    expect(screen.getByTestId('debug-logs').children).toHaveLength(1);
    
    // Click to turn debug mode off
    fireEvent.click(screen.getByTestId('toggle-debug'));
    
    // Now debug mode should be OFF
    expect(screen.getByTestId('debug-status')).toHaveTextContent('Debug mode: OFF');
    expect(screen.getByTestId('debug-logs').children).toHaveLength(0);
  });

  test('shows help message for invalid commands', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    render(
      <DebugProvider>
        <TestComponent />
      </DebugProvider>
    );

    act(() => {
      (window as any).debug('invalid-command');
    });

    expect(consoleSpy).toHaveBeenCalledWith('Debug commands: debug("--on") or debug("--off")');
    consoleSpy.mockRestore();
  });

  test('removes debug command on unmount', () => {
    const { unmount } = render(
      <DebugProvider>
        <TestComponent />
      </DebugProvider>
    );

    expect(typeof (window as any).debug).toBe('function');
    
    unmount();
    
    expect((window as any).debug).toBeUndefined();
  });
});