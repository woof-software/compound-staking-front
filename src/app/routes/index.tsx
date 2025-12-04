import { createFileRoute } from '@tanstack/react-router';

import { StakePage } from '@/pages/stake/StakePage';

export const Route = createFileRoute('/')({
  component: StakePage
});
