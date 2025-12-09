export function splitNumberUnit(value?: string): [string, string] {
  if (!value) return ['', ''];

  const v = value.trim();
  if (!v) return ['', ''];

  const lastChar = v.slice(-1);

  if (!/[a-zA-Z]/.test(lastChar)) {
    return [v, ''];
  }

  const numberPart = v.slice(0, -1).trim();

  return [numberPart, lastChar];
}
