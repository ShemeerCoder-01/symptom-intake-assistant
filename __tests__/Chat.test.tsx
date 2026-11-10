import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chat from '@/components/Chat';

function streamOf(...chunks: string[]) {
  const enc = new TextEncoder();
  let i = 0;
  return {
    ok: true,
    body: {
      getReader: () => ({
        read: async () => (i < chunks.length ? { done: false, value: enc.encode(chunks[i++]) } : { done: true, value: undefined }),
      }),
    },
  };
}

beforeEach(() => {
  global.fetch = jest.fn();
});

it('shows the greeting and a disabled summary button', () => {
  render(<Chat />);
  expect(screen.getByText(/what symptom is bothering you most/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /create doctor summary/i })).toBeDisabled();
});

it('blocks empty messages', async () => {
  render(<Chat />);
  await userEvent.click(screen.getByRole('button', { name: /send/i }));
  expect(await screen.findByRole('alert')).toHaveTextContent(/type a message/i);
  expect(global.fetch).not.toHaveBeenCalled();
});

it('streams the assistant reply into the chat', async () => {
  (global.fetch as jest.Mock).mockResolvedValue(streamOf('How long ', 'has this lasted?'));
  render(<Chat />);
  await userEvent.type(screen.getByLabelText(/your message/i), 'I have a headache');
  await userEvent.click(screen.getByRole('button', { name: /send/i }));
  expect(await screen.findByText('How long has this lasted?')).toBeInTheDocument();
  expect(screen.getByText('I have a headache')).toBeInTheDocument();
});

it('shows an error when the request fails', async () => {
  (global.fetch as jest.Mock).mockRejectedValue(new Error('Network down'));
  render(<Chat />);
  await userEvent.type(screen.getByLabelText(/your message/i), 'I have a cough');
  await userEvent.click(screen.getByRole('button', { name: /send/i }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Network down');
});

it('shows the server error message on a non-OK response', async () => {
  (global.fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({ error: 'Too many requests.' }) });
  render(<Chat />);
  await userEvent.type(screen.getByLabelText(/your message/i), 'fever');
  await userEvent.click(screen.getByRole('button', { name: /send/i }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Too many requests.');
});
