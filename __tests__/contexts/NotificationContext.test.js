import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { NotificationProvider, useNotification } from '../../contexts/NotificationContext';

// Mock child components so they don't bring in complex rendering
jest.mock('@/components/notifications/ToastContainer', () =>
  function MockToastContainer({ toasts, onClose }) {
    return (
      <div data-testid="toast-container">
        {toasts.map((t) => (
          <div key={t.id} data-testid={`toast-${t.type}`} data-id={t.id}>
            {t.message}
            <button onClick={() => onClose(t.id)}>close</button>
          </div>
        ))}
      </div>
    );
  }
);

jest.mock('@/components/notifications/ConfirmDialog', () =>
  function MockConfirmDialog({ isOpen, title, message, onConfirm, onClose }) {
    if (!isOpen) return null;
    return (
      <div data-testid="confirm-dialog">
        <span data-testid="dialog-title">{title}</span>
        <span data-testid="dialog-message">{message}</span>
        <button data-testid="confirm-btn" onClick={onConfirm}>Confirm</button>
        <button data-testid="cancel-btn" onClick={onClose}>Cancel</button>
      </div>
    );
  }
);

// Helper component to expose context methods via buttons
function ToastTrigger({ type = 'success', message = 'Hello', duration }) {
  const { toast } = useNotification();
  return (
    <button
      data-testid={`trigger-${type}`}
      onClick={() => toast[type](message, duration)}
    >
      {type}
    </button>
  );
}

function ConfirmTrigger({ onResult }) {
  const { confirm } = useNotification();
  return (
    <button
      data-testid="trigger-confirm"
      onClick={async () => {
        const result = await confirm({ title: 'Delete?', message: 'Are you sure?' });
        onResult(result);
      }}
    >
      Confirm
    </button>
  );
}

function renderWithProvider(ui) {
  return render(<NotificationProvider>{ui}</NotificationProvider>);
}

describe('toast', () => {
  it('renders a success toast', async () => {
    renderWithProvider(<ToastTrigger type="success" message="Saved!" />);

    await act(async () => {
      screen.getByTestId('trigger-success').click();
    });

    expect(screen.getByTestId('toast-success').textContent).toContain('Saved!');
  });

  it('renders an error toast', async () => {
    renderWithProvider(<ToastTrigger type="error" message="Oops!" />);

    await act(async () => {
      screen.getByTestId('trigger-error').click();
    });

    expect(screen.getByTestId('toast-error').textContent).toContain('Oops!');
  });

  it('renders a warning toast', async () => {
    renderWithProvider(<ToastTrigger type="warning" message="Warning!" />);

    await act(async () => {
      screen.getByTestId('trigger-warning').click();
    });

    expect(screen.getByTestId('toast-warning').textContent).toContain('Warning!');
  });

  it('renders an info toast', async () => {
    renderWithProvider(<ToastTrigger type="info" message="FYI" />);

    await act(async () => {
      screen.getByTestId('trigger-info').click();
    });

    expect(screen.getByTestId('toast-info').textContent).toContain('FYI');
  });

  it('removes toast when close button is clicked', async () => {
    renderWithProvider(<ToastTrigger type="success" message="Remove me" />);

    await act(async () => {
      screen.getByTestId('trigger-success').click();
    });

    expect(screen.getByTestId('toast-success')).toBeInTheDocument();

    await act(async () => {
      screen.getByText('close').click();
    });

    expect(screen.queryByTestId('toast-success')).not.toBeInTheDocument();
  });

  it('can add multiple toasts', async () => {
    renderWithProvider(
      <>
        <ToastTrigger type="success" message="First" />
        <ToastTrigger type="error" message="Second" />
      </>
    );

    await act(async () => {
      screen.getByTestId('trigger-success').click();
      screen.getByTestId('trigger-error').click();
    });

    expect(screen.getByTestId('toast-success')).toBeInTheDocument();
    expect(screen.getByTestId('toast-error')).toBeInTheDocument();
  });
});

describe('confirm', () => {
  it('shows the confirm dialog with correct title and message', async () => {
    const onResult = jest.fn();
    renderWithProvider(<ConfirmTrigger onResult={onResult} />);

    await act(async () => {
      screen.getByTestId('trigger-confirm').click();
    });

    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title').textContent).toBe('Delete?');
    expect(screen.getByTestId('dialog-message').textContent).toBe('Are you sure?');
  });

  it('resolves true when confirmed', async () => {
    const onResult = jest.fn();
    renderWithProvider(<ConfirmTrigger onResult={onResult} />);

    await act(async () => {
      screen.getByTestId('trigger-confirm').click();
    });

    await act(async () => {
      screen.getByTestId('confirm-btn').click();
    });

    expect(onResult).toHaveBeenCalledWith(true);
    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
  });

  it('resolves false when cancelled', async () => {
    const onResult = jest.fn();
    renderWithProvider(<ConfirmTrigger onResult={onResult} />);

    await act(async () => {
      screen.getByTestId('trigger-confirm').click();
    });

    await act(async () => {
      screen.getByTestId('cancel-btn').click();
    });

    expect(onResult).toHaveBeenCalledWith(false);
    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
  });
});

describe('useNotification', () => {
  it('throws when used outside NotificationProvider', () => {
    const OriginalConsoleError = console.error;
    console.error = jest.fn();

    function BadConsumer() {
      useNotification();
      return null;
    }

    expect(() => render(<BadConsumer />)).toThrow(
      'useNotification must be used within a NotificationProvider'
    );

    console.error = OriginalConsoleError;
  });
});
