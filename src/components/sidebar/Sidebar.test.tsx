import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Sidebar } from './Sidebar';
import type { Chat } from '../../types';

const mockChats: Chat[] = [
  {
    id: 'c1',
    title: 'Как работает React',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [{ id: 'm1', role: 'user', content: 'Привет', createdAt: Date.now() }],
  },
  {
    id: 'c2',
    title: 'Настройка Vite',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [{ id: 'm2', role: 'user', content: 'Как настроить?', createdAt: Date.now() }],
  },
  {
    id: 'c3',
    title: 'Zustand vs Redux',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
  },
];

const renderSidebar = () =>
  render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>,
  );

describe('Sidebar', () => {
  beforeEach(() => {
    useAppStore.setState({
      chats: mockChats,
      activeChatId: 'c1',
      streaming: { isStreaming: false, streamingMessageId: null },
      ui: { isSidebarOpen: true, activeModal: null, modalTargetChatId: null },
    });
  });

  it('renders all chats', () => {
    renderSidebar();
    expect(screen.getByText('Как работает React')).toBeInTheDocument();
    expect(screen.getByText('Настройка Vite')).toBeInTheDocument();
    expect(screen.getByText('Zustand vs Redux')).toBeInTheDocument();
  });

  it('filters chats by search query', async () => {
    const user = userEvent.setup();
    renderSidebar();

    const searchInput = screen.getByLabelText('Поиск по чатам');
    await user.type(searchInput, 'React');

    expect(screen.getByText('Как работает React')).toBeInTheDocument();
    expect(screen.queryByText('Настройка Vite')).not.toBeInTheDocument();
    expect(screen.queryByText('Zustand vs Redux')).not.toBeInTheDocument();
  });

  it('shows all chats when search is empty', async () => {
    const user = userEvent.setup();
    renderSidebar();

    const searchInput = screen.getByLabelText('Поиск по чатам');
    await user.type(searchInput, 'React');
    await user.clear(searchInput);

    expect(screen.getByText('Как работает React')).toBeInTheDocument();
    expect(screen.getByText('Настройка Vite')).toBeInTheDocument();
    expect(screen.getByText('Zustand vs Redux')).toBeInTheDocument();
  });

  it('shows empty state when nothing matches', async () => {
    const user = userEvent.setup();
    renderSidebar();

    await user.type(screen.getByLabelText('Поиск по чатам'), 'несуществующий');

    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
  });

  it('search is case-insensitive', async () => {
    const user = userEvent.setup();
    renderSidebar();

    await user.type(screen.getByLabelText('Поиск по чатам'), 'react');

    expect(screen.getByText('Как работает React')).toBeInTheDocument();
  });

  it('opens delete modal when delete button is clicked', async () => {
    const user = userEvent.setup();
    renderSidebar();

    const deleteButtons = screen.getAllByLabelText('Удалить чат');
    await user.click(deleteButtons[0]);

    expect(useAppStore.getState().ui.activeModal).toBe('delete');
    expect(screen.getByText(/Удалить чат/)).toBeInTheDocument();
  });

  it('has new chat button', () => {
    renderSidebar();
    expect(screen.getByText('Новый чат')).toBeInTheDocument();
  });
});
