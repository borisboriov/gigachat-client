import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputArea } from './InputArea';

const setup = (props: Partial<Parameters<typeof InputArea>[0]> = {}) => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    onSubmit: vi.fn(),
    onStop: vi.fn(),
    isLoading: false,
    ...props,
  };
  const utils = render(<InputArea {...defaultProps} />);
  const textarea = screen.getByLabelText('Введите сообщение');
  return { ...utils, ...defaultProps, textarea };
};

describe('InputArea', () => {
  it('renders textarea and send button', () => {
    setup();
    expect(screen.getByLabelText('Введите сообщение')).toBeInTheDocument();
    expect(screen.getByLabelText('Отправить сообщение')).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    setup({ value: '' });
    const btn = screen.getByLabelText('Отправить сообщение');
    expect(btn).toBeDisabled();
  });

  it('send button is enabled when input has text', () => {
    setup({ value: 'Привет' });
    const btn = screen.getByLabelText('Отправить сообщение');
    expect(btn).not.toBeDisabled();
  });

  it('calls onSubmit when clicking send button with text', async () => {
    const user = userEvent.setup();
    const { onSubmit } = setup({ value: 'Тест' });

    await user.click(screen.getByLabelText('Отправить сообщение'));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('does not call onSubmit when clicking disabled send button', async () => {
    const user = userEvent.setup();
    const { onSubmit } = setup({ value: '' });

    await user.click(screen.getByLabelText('Отправить сообщение'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit on Enter with non-empty input', async () => {
    const user = userEvent.setup();
    const { onSubmit, textarea } = setup({ value: 'Сообщение' });

    await user.type(textarea, '{Enter}');
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('does not call onSubmit on Shift+Enter', async () => {
    const user = userEvent.setup();
    const { onSubmit, textarea } = setup({ value: 'Сообщение' });

    await user.type(textarea, '{Shift>}{Enter}{/Shift}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not call onSubmit on Enter with empty input', async () => {
    const user = userEvent.setup();
    const { onSubmit, textarea } = setup({ value: '' });

    await user.type(textarea, '{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows stop button when isLoading is true', () => {
    setup({ isLoading: true });
    expect(screen.getByLabelText('Остановить генерацию')).toBeInTheDocument();
    expect(screen.queryByLabelText('Отправить сообщение')).not.toBeInTheDocument();
  });

  it('calls onStop when clicking stop button', async () => {
    const user = userEvent.setup();
    const { onStop } = setup({ isLoading: true });

    await user.click(screen.getByLabelText('Остановить генерацию'));
    expect(onStop).toHaveBeenCalledOnce();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const { onChange, textarea } = setup();

    await user.type(textarea, 'A');
    expect(onChange).toHaveBeenCalled();
  });
});
