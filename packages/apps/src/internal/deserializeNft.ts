// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Root } from 'protobufjs';

import convertEnumToString from './convertEnumToString';

export type FieldRuleType = 'optional' | 'required' | 'repeated';

export type ProtobufAttributeType = {
  nested: {
    onChainMetaData: {
      nested: {
        [key: string]: {
          fields?: {
            [key: string]: {
              id: number;
              rule: FieldRuleType;
              type: string;
            }
          }
          options?: { [key: string]: string };
          values?: { [key: string]: number };
        }
      }
    }
  }
}

function deserializeNft (root: Root, buffer: Uint8Array, locale: string): { [key: string]: any } {
  try {
    // Obtain the message type
    const NFTMeta = root.lookupType('onChainMetaData.NFTMeta');
    // Decode a Uint8Array (browser) or Buffer (node) to a message
    const message = NFTMeta.decode(buffer);
    // Maybe convert the message back to a plain object
    const objectItem = NFTMeta.toObject(message, {
      arrays: true, // populates empty arrays (repeated fields) even if defaults=false
      bytes: String, // bytes as base64 encoded strings
      defaults: true, // includes default values
      enums: String, // enums as string names
      longs: String, // longs as strings (requires long.js)
      objects: true, // populates empty objects (map fields) even if defaults=false
      oneofs: true
    });
    const newObjectItem = { ...objectItem };

    for (const key in objectItem) {
      if (NFTMeta?.fields[key]?.resolvedType?.options && Object.keys(NFTMeta?.fields[key]?.resolvedType?.options as {[key: string]: string}).length > 0) {
        if (Array.isArray(objectItem[key])) {
          const item = objectItem[key] as string[];

          item.forEach((value: string, index) => {
            (newObjectItem[key] as string[])[index] = convertEnumToString(value, key, NFTMeta, locale);
          });
        } else {
          newObjectItem[key] = convertEnumToString(objectItem[key], key, NFTMeta, locale);
        }
      }
    }

    return newObjectItem;
  } catch (e) {
    console.log('deserializeNft error', e);
  }

  return {};
}

export default deserializeNft;
