import { createFileRoute } from '@tanstack/react-router';

import { IntakePage } from '@/features/prd-ingestion/pages/intake/intake';

export const Route = createFileRoute('/prd-ingestion/intake')({
  component: RouteComponent,
});

function RouteComponent() {
  return <IntakePage />;
}
