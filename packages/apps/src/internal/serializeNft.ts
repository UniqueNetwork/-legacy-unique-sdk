// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Root } from 'protobufjs';

function serializeNft (payload: { [key: string]: number | number[] | string }, protoRoot: Root): Uint8Array {
  const NFTMeta = protoRoot.lookupType('onChainMetaData.NFTMeta');
  const errMsg = NFTMeta.verify(payload);

  if (errMsg) {
    throw Error(errMsg);
  }

  // Create a new message
  const message = NFTMeta.create(payload);

  // Encode a message to an Uint8Array (browser) or Buffer (node)
  return NFTMeta.encode(message).finish();
}

export default serializeNft;
