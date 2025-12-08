import { useCallback, useState } from 'react';

type CopiedValue = string | null;
type PastedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>;
type PasteFn = () => Promise<boolean>;

export function useClipboard() {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);
  const [pastedText, setPastedText] = useState<PastedValue>(null);

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  }, []);

  const paste: PasteFn = useCallback(async () => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }
    try {
      const text = await navigator.clipboard.readText();
      setPastedText(text);
      return true;
    } catch (error) {
      console.warn('Paste failed', error);
      setPastedText(null);
      return false;
    }
  }, []);

  const clearCopied = useCallback(() => setCopiedText(null), []);
  const clearPasted = useCallback(() => setPastedText(null), []);

  return { copiedText, pastedText, copy, paste, clearCopied, clearPasted };
}
