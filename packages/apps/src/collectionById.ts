// [object Object]
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
import type { NftCollectionInterface } from './types';

import { ApiPromise } from '@polkadot/api';

async function collectionById(api: ApiPromise, collectionId: number): Promise<NftCollectionInterface> {
  return (await api.query.nft.collectionById(collectionId)).toJSON() as unknown as NftCollectionInterface;
}

export default collectionById;
