import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateBooking from '../CreateBooking';
import * as contractService from '../../../services/contractService';

vi.mock('../../../services/contractService');

describe('CreateBooking Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with title and input field', () => {
    render(<CreateBooking />);
    expect(screen.getByText('Create Booking')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount (ETH)')).toBeInTheDocument();
  });

  it('shows validation error when amount is empty', async () => {
    render(<CreateBooking />);
    const button = screen.getByRole('button', { name: /Create Booking/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid amount')).toBeInTheDocument();
    });
  });

  it('shows validation error when amount is zero or negative', async () => {
    render(<CreateBooking />);
    const input = screen.getByPlaceholderText('0.1');
    const button = screen.getByRole('button', { name: /Create Booking/i });

    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid amount')).toBeInTheDocument();
    });
  });

  it('calls contractService.createBooking with correct amount', async () => {
    const mockTx = { wait: vi.fn() };
    contractService.contractService.createBooking.mockResolvedValue(mockTx);

    render(<CreateBooking />);
    const input = screen.getByPlaceholderText('0.1');
    const button = screen.getByRole('button', { name: /Create Booking/i });

    fireEvent.change(input, { target: { value: '1.5' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(contractService.contractService.createBooking).toHaveBeenCalledWith('1.5');
    });
  });

  it('shows loading state while processing', async () => {
    const mockTx = { wait: vi.fn().mockImplementation(() => new Promise(() => {})) };
    contractService.contractService.createBooking.mockResolvedValue(mockTx);

    render(<CreateBooking />);
    const input = screen.getByPlaceholderText('0.1');
    const button = screen.getByRole('button', { name: /Create Booking/i });

    fireEvent.change(input, { target: { value: '1.0' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Processing.../)).toBeInTheDocument();
    });
  });

  it('clears input after successful booking creation', async () => {
    const mockTx = { wait: vi.fn(), hash: '0xabc123' };
    contractService.contractService.createBooking.mockResolvedValue(mockTx);

    render(<CreateBooking />);
    const input = screen.getByPlaceholderText('0.1');
    const button = screen.getByRole('button', { name: /Create Booking/i });

    fireEvent.change(input, { target: { value: '2.0' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('shows error alert on transaction failure', async () => {
    const error = new Error('Insufficient funds');
    contractService.contractService.createBooking.mockRejectedValue(error);

    render(<CreateBooking />);
    const input = screen.getByPlaceholderText('0.1');
    const button = screen.getByRole('button', { name: /Create Booking/i });

    fireEvent.change(input, { target: { value: '1.0' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
    });
  });
});
