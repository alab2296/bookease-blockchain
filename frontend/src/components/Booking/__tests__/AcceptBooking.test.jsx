import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AcceptBooking from '../AcceptBooking';
import * as contractService from '../../../services/contractService';

vi.mock('../../../services/contractService');

describe('AcceptBooking Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct title and input', () => {
    render(<AcceptBooking />);
    expect(screen.getByText('Accept Booking')).toBeInTheDocument();
    expect(screen.getByLabelText('Booking ID')).toBeInTheDocument();
  });

  it('validates that booking ID is required', async () => {
    render(<AcceptBooking />);
    const button = screen.getByRole('button', { name: /Accept Booking/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid booking ID')).toBeInTheDocument();
    });
  });

  it('validates that booking ID must be positive', async () => {
    render(<AcceptBooking />);
    const input = screen.getByPlaceholderText('e.g., 1');
    const button = screen.getByRole('button', { name: /Accept Booking/i });

    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid booking ID')).toBeInTheDocument();
    });
  });

  it('calls acceptBooking with correct booking ID', async () => {
    const mockTx = { wait: vi.fn() };
    contractService.contractService.acceptBooking.mockResolvedValue(mockTx);

    render(<AcceptBooking />);
    const input = screen.getByPlaceholderText('e.g., 1');
    const button = screen.getByRole('button', { name: /Accept Booking/i });

    fireEvent.change(input, { target: { value: '42' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(contractService.contractService.acceptBooking).toHaveBeenCalledWith('42');
    });
  });

  it('shows success feedback after accepting', async () => {
    const mockTx = { wait: vi.fn() };
    contractService.contractService.acceptBooking.mockResolvedValue(mockTx);

    render(<AcceptBooking />);
    const input = screen.getByPlaceholderText('e.g., 1');
    const button = screen.getByRole('button', { name: /Accept Booking/i });

    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Booking #5 accepted successfully!')).toBeInTheDocument();
    });
  });

  it('clears input after successful acceptance', async () => {
    const mockTx = { wait: vi.fn() };
    contractService.contractService.acceptBooking.mockResolvedValue(mockTx);

    render(<AcceptBooking />);
    const input = screen.getByPlaceholderText('e.g., 1');
    const button = screen.getByRole('button', { name: /Accept Booking/i });

    fireEvent.change(input, { target: { value: '7' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('displays error message on contract error', async () => {
    const error = new Error('Booking not found');
    contractService.contractService.acceptBooking.mockRejectedValue(error);

    render(<AcceptBooking />);
    const input = screen.getByPlaceholderText('e.g., 1');
    const button = screen.getByRole('button', { name: /Accept Booking/i });

    fireEvent.change(input, { target: { value: '999' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Booking not found')).toBeInTheDocument();
    });
  });
});
