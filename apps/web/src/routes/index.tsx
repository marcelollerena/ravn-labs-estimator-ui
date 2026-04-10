import type { ReactNode } from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent(): ReactNode {
  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
      <h1>Estimator</h1>
      <p>AI-Enhanced Project Scoping</p>
    </main>
  );
}
