// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TokenDetailsInterface } from '@polkadot/apps/types';

import { ApiPromise } from '@polkadot/api';

import hexToBuffer from './internal/hexToBuffer';

/**
 *
 * @since 1.0.0
 * @param {Object} api
 * @param {number} collectionId
 * @param {number} id
 * @returns {Object} {owner, buffer}
 * @example
 */
async function getToken (api: ApiPromise, collectionId: string, id: string): Promise<{ buffer: Uint8Array, owner: string }> {
  const token: TokenDetailsInterface = (await api.query.nft.nftItemList(collectionId, id)).toJSON() as unknown as TokenDetailsInterface;

  return {
    buffer: hexToBuffer(token.ConstData.toString()) as Uint8Array,
    owner: token.Owner.toString()
  };
}

export default getToken;
