import { createFileRoute } from '@tanstack/react-router';

import { StakePage } from '@/pages/Stake/StakePage';

export const Route = createFileRoute('/')({
  component: StakePage
});
