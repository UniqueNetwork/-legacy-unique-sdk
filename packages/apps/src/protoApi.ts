// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Root } from 'protobufjs/light';
import type { ProtobufAttributeType } from './types';

import deserializeNft from './internal/deserializeNft';
import getProtoRoot from './internal/getProtoRoot';
import serializeNft from './internal/serializeNft';

/**
 * @since 1.0.0
 * @example
 *
 */
class ProtoApi {
  _nestedData: Root;
  /**
   *
   * @param {Object} nestedData
   *
   */
  constructor (nestedData: ProtobufAttributeType) {
    this._nestedData = getProtoRoot(nestedData);
  }

  /**
   *
   * @param { [key: string]: number | number[] | string } payload
   * @returns
   * @example
   *
   */
  serialize (payload: { [key: string]: number | number[] | string }): Uint8Array {
    return serializeNft(payload, this._nestedData);
  }

  /**
   *
   * @param {Uint8Array} buffer
   * @param {string} locale
   * @returns {Object}
   * @example
   *
   */
  deserialize (buffer: Uint8Array, locale: string): { [key: string]: any } {
    return deserializeNft(this._nestedData, buffer, locale);
  }
}

export default ProtoApi;
