// import { useState } from 'react';
//
// import type { DelegateType } from '@/shared/types/common';
// import { Modal } from '@/components/ui/Modal';
//
// export type StakeModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
// };
//
// export function StakeModal({ isOpen, onClose }: StakeModalProps) {
//   const [type, setType] = useState<'stake' | 'delegate'>('stake');
//   const [inputValue, setInputValue] = useState<string>('');
//   const [selectedAddressDelegate, setSelectedAddressDelegate] = useState<string | null>(null);
//   const [delegateType, setDelegateType] = useState<DelegateType>('Delegatee');
//
//   const onInputChange = (value: string) => {
//     setInputValue(value);
//   };
//
//   const onTypeChange = (newType: 'stake' | 'delegate') => {
//     setType(newType);
//   };
//
//   const onDelegateTypeChange = (value: DelegateType) => {
//     setDelegateType(value);
//   };
//
//   const onBack = () => {
//     onTypeChange('stake');
//   };
//
//   return (
//     <Modal
//       open={isOpen}
//       title={type === 'stake' ? 'Stake COMP tokens' : 'Choose Delegatee'}
//       onBack={type === 'delegate' ? onBack : undefined}
//       onClose={onClose}
//     >
//       {type === 'stake' && (
//         <StakeFlowModal
//           inputValue={inputValue}
//           selectedAddressDelegate={selectedAddressDelegate}
//           delegateTypeSelected={delegateType}
//           onInputChange={onInputChange}
//           onTypeChange={onTypeChange}
//           onDelegateTypeSelect={onDelegateTypeChange}
//           onAddressDelegateSelect={setSelectedAddressDelegate}
//         />
//       )}
//       {type === 'delegate' && (
//         <DelegateFlowModal
//           selectedAddressDelegate={selectedAddressDelegate}
//           onAddressDelegateSelect={setSelectedAddressDelegate}
//           onTypeChange={onTypeChange}
//         />
//       )}
//     </Modal>
//   );
// }
