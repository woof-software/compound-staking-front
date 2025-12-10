import { createFileRoute } from '@tanstack/react-router';

import { StakePage } from '@/pages/StakePage';

export const Route = createFileRoute('/')({
  component: StakePage
});
