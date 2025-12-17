import type { Hex } from 'viem';

export const V2_URL = 'https://v2-app.compound.finance';
export const TERMS_URL = `${V2_URL}/#terms`;
export const TALLY_GOV_URL = 'https://www.tally.xyz/gov/compound';

export const APPLICATION_CHAIN = 1;

export const DEFAULT_INTEGER_PART_LENGTH = 16;

/* DELEGATES  */
export type Delegate = { name: string; address: Hex };

export const DELEGATES: Delegate[] = [
  { name: 'Compound Foundation', address: '0xb06df4dd01a5c5782f360ada9345c87e86adae3d' },
  { name: 'WOOF!', address: '0xd2A79F263eC55DBC7B724eCc20FC7448D4795a0C' },
  { name: 'PGov', address: '0x3FB19771947072629C8EEE7995a2eF23B72d4C8A' },
  { name: 'Arana', address: '0x0579A616689f7ed748dC07692A3F150D44b0CA09' },
  { name: 'Gauntlet', address: '0x683a4F9915D6216f73d6Df50151725036bD26C02' },
  { name: 'Avantgarde', address: '0xB49f8b8613bE240213C1827e2E576044fFEC7948' },
  { name: 'Michigan Blockchain', address: '0x13BDaE8c5F0fC40231F0E6A4ad70196F59138548' },
  { name: 'FranklinDAO', address: '0x070341aA5Ed571f0FB2c4a5641409B1A46b4961b' },
  { name: 'allthecolors', address: '0x66cD62c6F8A4BB0Cd8720488BCBd1A6221B765F9' },
  { name: 'Arr00', address: '0x2B384212EDc04Ae8bB41738D05BA20E33277bf33' },
  { name: 'Wintermute', address: '0xB933AEe47C438f22DE0747D57fc239FE37878Dd1' },
  { name: 'a16z', address: '0x9aa835bc7b8ce13b9b0c9764a52fbf71ac62ccf1' }
];

/* TIME */
export const MINUTE_SECONDS = 60 * 1000;
