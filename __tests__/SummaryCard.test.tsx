import { render, screen } from '@testing-library/react';
import SummaryCard from '@/components/SummaryCard';
import { normalizeSummary } from '@/lib/summary';

it('shows an empty state', () => {
  render(<SummaryCard summary={null} loading={false} />);
  expect(screen.getByText(/answer a few questions/i)).toBeInTheDocument();
});

it('shows a loading state', () => {
  render(<SummaryCard summary={null} loading />);
  expect(screen.getByText(/preparing the summary/i)).toBeInTheDocument();
});

it('renders fields and red flags', () => {
  const summary = normalizeSummary({ chiefComplaint: 'Chest tightness', duration: '2 days', redFlags: ['Chest pain'] });
  render(<SummaryCard summary={summary} loading={false} />);
  expect(screen.getByText('Chest tightness')).toBeInTheDocument();
  expect(screen.getByRole('alert')).toHaveTextContent('Chest pain');
});
