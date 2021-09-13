/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable header/header */
// [object Object]
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { RegistryTypes } from '@polkadot/types/types';

/**
 *
 * @since 1.0.0
 * @param {string} endpoint
 * @param {RegistryTypes} rtt
 * @returns {Object}
 * @example
 *
 */
async function connect(endpoint: string, rtt: RegistryTypes) {
  const wsProvider = new WsProvider(endpoint);
  let api = null;

  if (rtt) {
    api = new ApiPromise({
      provider: wsProvider,
      // @ts-ignore
      types: rtt
    });
  } else {
    api = new ApiPromise({
      provider: wsProvider
    });
  }

  try {
    await api.isReady;

    console.log('connection ready');

    return api;
  }
  catch (error) {
    console.error(error);

    // @ts-ignore
    throw Error(error);
  }
}

export default connect;
