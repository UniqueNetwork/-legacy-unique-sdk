/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable header/header */
// [object Object]
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise } from '@polkadot/api';

import parseHexToString from './internal/parseHexToString';
import collectionById from './collectionById';

/**
 *
 * @since 1.0.0
 * @param {Object} api
 * @param {number} id
 * @returns Object
 * @example
 *
 */
async function getOnChainSchema (api: ApiPromise, id: number) {
  const collection = await collectionById(api, id);

  return JSON.parse(
    parseHexToString(collection.ConstOnChainSchema)
  );
}

export default getOnChainSchema;
