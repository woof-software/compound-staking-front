import { RewardsBudget } from './RewardsBudget';
import { StakingAPR } from './StakingAPR';
import { TotalStaked } from './TotalStaked';

const StatisticsBlock = () => {
  return (
    <section className='statistics-block-container'>
      <RewardsBudget />
      <StakingAPR />
      <TotalStaked />
    </section>
  );
};

export { StatisticsBlock };
