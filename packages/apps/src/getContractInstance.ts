/* eslint-disable header/header */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// [object Object]
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise } from '@polkadot/api';
import { Abi, ContractPromise } from '@polkadot/api-contract';

function getContractInstance (api: ApiPromise, abi: Abi, marketContractAddress: string): ContractPromise {
  return new ContractPromise(api, abi, marketContractAddress);
}

export default getContractInstance;
