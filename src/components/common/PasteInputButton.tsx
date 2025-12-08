import { CrossIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import type { ClassNames } from '@/shared/types/common';

export type PasteInputButtonProps = {
  classNames?: ClassNames;
  isPasted: boolean;
  onPaste: () => void;
  onClear: () => void;
};

export function PasteInputButton({ isPasted, classNames, onPaste, onClear }: PasteInputButtonProps) {
  return (
    <>
      <Condition if={isPasted}>
        <CrossIcon
          onClick={onClear}
          className='absolute size-4 text-color-25 right-2.5 top-[17px] cursor-pointer'
        />
      </Condition>
      <Condition if={!isPasted}>
        <Button
          onClick={onPaste}
          className={cn(
            'bg-color-9 absolute right-2.5 top-[9.5px] rounded-4xl w-[52px] h-[33px] !text-color-24 text-11 font-medium',
            classNames?.button
          )}
        >
          Paste
        </Button>
      </Condition>
    </>
  );
}
