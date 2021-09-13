/* eslint-disable header/header */
/* eslint-disable simple-import-sort/imports */
// [object Object]
// SPDX-License-Identifier: Apache-2.0

import type { AnyJson } from '@polkadot/types/types';
import { Abi } from '@polkadot/api-contract';

function getAbi (marketContractAbi: AnyJson): Abi {
  return new Abi(marketContractAbi);
}

export default getAbi;
