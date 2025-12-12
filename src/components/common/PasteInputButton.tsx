import { CrossIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';

export type PasteInputButtonProps = {
  isPasted: boolean;
  onPaste: () => void;
  onClear: () => void;
};

export function PasteInputButton({ isPasted, onPaste, onClear }: PasteInputButtonProps) {
  return (
    <>
      <Condition if={isPasted}>
        <CrossIcon
          onClick={onClear}
          className='size-4 shrink-0 text-color-25 cursor-pointer'
        />
      </Condition>
      <Condition if={!isPasted}>
        <Button
          onClick={onPaste}
          className='bg-color-9 rounded-4xl w-13 h-8 !text-color-24 text-11 font-medium'
        >
          Paste
        </Button>
      </Condition>
    </>
  );
}
