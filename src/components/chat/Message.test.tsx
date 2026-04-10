import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Message } from './Message';
import type { Message as MessageType } from '../../types';

const createMessage = (overrides: Partial<MessageType> = {}): MessageType => ({
  id: 'msg-1',
  role: 'user',
  content: 'Тестовое сообщение',
  createdAt: Date.now(),
  ...overrides,
});

describe('Message', () => {
  describe('variant="user"', () => {
    it('renders user message content', () => {
      render(<Message message={createMessage()} variant="user" />);
      expect(screen.getByText('Тестовое сообщение')).toBeInTheDocument();
    });

    it('shows "Вы" as the sender', () => {
      render(<Message message={createMessage()} variant="user" />);
      expect(screen.getByText('Вы')).toBeInTheDocument();
    });

    it('applies user CSS class', () => {
      const { container } = render(<Message message={createMessage()} variant="user" />);
      expect(container.querySelector('.messageRowUser')).toBeInTheDocument();
      expect(container.querySelector('.bubbleUser')).toBeInTheDocument();
    });

    it('does not show copy button', () => {
      render(<Message message={createMessage()} variant="user" />);
      expect(screen.queryByText('Копировать')).not.toBeInTheDocument();
    });

    it('does not show avatar', () => {
      render(<Message message={createMessage()} variant="user" />);
      expect(screen.queryByText('GC')).not.toBeInTheDocument();
    });
  });

  describe('variant="assistant"', () => {
    it('renders assistant message content', () => {
      render(
        <Message message={createMessage({ role: 'assistant', content: 'Ответ ассистента' })} variant="assistant" />,
      );
      expect(screen.getByText('Ответ ассистента')).toBeInTheDocument();
    });

    it('shows "GigaChat" as the sender', () => {
      render(<Message message={createMessage({ role: 'assistant' })} variant="assistant" />);
      expect(screen.getByText('GigaChat')).toBeInTheDocument();
    });

    it('applies assistant CSS class', () => {
      const { container } = render(
        <Message message={createMessage({ role: 'assistant' })} variant="assistant" />,
      );
      expect(container.querySelector('.bubbleAssistant')).toBeInTheDocument();
      expect(container.querySelector('.bubbleUser')).not.toBeInTheDocument();
    });

    it('shows copy button', () => {
      render(<Message message={createMessage({ role: 'assistant' })} variant="assistant" />);
      expect(screen.getByText('Копировать')).toBeInTheDocument();
    });

    it('shows GC avatar', () => {
      render(<Message message={createMessage({ role: 'assistant' })} variant="assistant" />);
      expect(screen.getByText('GC')).toBeInTheDocument();
    });

    it('copies content to clipboard on copy button click', async () => {
      const user = userEvent.setup();
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        writable: true,
        configurable: true,
      });

      render(
        <Message
          message={createMessage({ role: 'assistant', content: 'Копируемый текст' })}
          variant="assistant"
        />,
      );

      await user.click(screen.getByText('Копировать'));
      expect(writeText).toHaveBeenCalledWith('Копируемый текст');
    });

    it('shows "Скопировано" after copying', async () => {
      const user = userEvent.setup();
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
        writable: true,
        configurable: true,
      });

      render(
        <Message message={createMessage({ role: 'assistant' })} variant="assistant" />,
      );

      await user.click(screen.getByText('Копировать'));
      expect(await screen.findByText('Скопировано')).toBeInTheDocument();
    });
  });

  it('displays formatted timestamp', () => {
    const date = new Date(2025, 0, 15, 14, 30);
    render(<Message message={createMessage({ createdAt: date.getTime() })} variant="user" />);
    expect(screen.getByText('14:30')).toBeInTheDocument();
  });
});
