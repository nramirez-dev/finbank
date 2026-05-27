import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { TransferForm } from '@/components/organisms/TransferForm';
import type { Account } from '@/domain/entities/Account';

describe('TransferForm integration', () => {
  const accounts: Account[] = [
    {
      id: 'acc-001',
      balance: 1000,
      currency: 'DOP',
      type: 'ahorros',
      ownerId: 'user-001',
    },
    {
      id: 'acc-002',
      balance: 2000,
      currency: 'DOP',
      type: 'corriente',
      ownerId: 'user-001',
    },
  ];

  it('shows validation errors on empty submit', async () => {
    const onSubmit = jest.fn();
    const { getByText } = render(
      <TransferForm accounts={accounts} onSubmit={onSubmit} />
    );

    await act(async () => {
      fireEvent.press(getByText('Confirmar'));
    });

    await waitFor(() => {
      expect(getByText('Selecciona cuenta origen')).toBeTruthy();
      expect(getByText('Selecciona cuenta destino')).toBeTruthy();
      expect(getByText('El monto debe ser mayor a 0')).toBeTruthy();
      expect(getByText(/3 caracteres/i)).toBeTruthy();
    });
  });

  it('closes modal when Cancelar is pressed', async () => {
    const onSubmit = jest.fn();
    const { getAllByText, getByLabelText, getByText } = render(
      <TransferForm accounts={accounts} onSubmit={onSubmit} />
    );

    // Fill form to enable opening the confirm modal
    const fromOptions = getAllByText('AHORROS · DOP');
    await act(async () => { fireEvent.press(fromOptions[0]); });

    const toOptions = getAllByText('CORRIENTE · DOP');
    await act(async () => { fireEvent.press(toOptions[1]); });

    await act(async () => {
      fireEvent.changeText(getByLabelText('Monto'), '200');
      fireEvent.changeText(getByLabelText('Descripcion'), 'Test cancel');
    });

    await act(async () => { fireEvent.press(getByText('Confirmar')); });

    // Press Cancelar — covers line 190: () => setIsConfirmOpen(false)
    await act(async () => { fireEvent.press(getByText('Cancelar')); });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows error card when onSubmit throws', async () => {
    const onSubmit = jest.fn(() => { throw new Error('Fondos insuficientes'); });
    const { getAllByText, getByLabelText, getByText } = render(
      <TransferForm accounts={accounts} onSubmit={onSubmit} />
    );

    const fromOptions = getAllByText('AHORROS · DOP');
    await act(async () => { fireEvent.press(fromOptions[0]); });

    const toOptions = getAllByText('CORRIENTE · DOP');
    await act(async () => { fireEvent.press(toOptions[1]); });

    await act(async () => {
      fireEvent.changeText(getByLabelText('Monto'), '999');
      fireEvent.changeText(getByLabelText('Descripcion'), 'Pago fallido');
    });

    await act(async () => { fireEvent.press(getByText('Confirmar')); });

    const confirmButtons = getAllByText('Confirmar');
    await act(async () => {
      fireEvent.press(confirmButtons[confirmButtons.length - 1]);
    });

    // covers lines 70-71: catch block sets status='error' and statusMessage
    await waitFor(() => {
      expect(getByText('Transferencia fallida')).toBeTruthy();
    });
  });

  it('submits valid transfer after confirmation', async () => {
    const onSubmit = jest.fn();
    const { getAllByText, getByLabelText, getByText } = render(
      <TransferForm accounts={accounts} onSubmit={onSubmit} />
    );

    const fromOptions = getAllByText('AHORROS · DOP');
    await act(async () => {
      fireEvent.press(fromOptions[0]);
    });

    const toOptions = getAllByText('CORRIENTE · DOP');
    await act(async () => {
      fireEvent.press(toOptions[1]);
    });

    await act(async () => {
      fireEvent.changeText(getByLabelText('Monto'), '1500');
      fireEvent.changeText(getByLabelText('Descripcion'), 'Pago renta');
    });

    await act(async () => {
      fireEvent.press(getByText('Confirmar'));
    });

    const confirmButtons = getAllByText('Confirmar');
    await act(async () => {
      fireEvent.press(confirmButtons[confirmButtons.length - 1]);
    });

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        fromAccountId: 'acc-001',
        toAccountId: 'acc-002',
        amount: 1500,
        description: 'Pago renta',
      });
    });
  });
});
