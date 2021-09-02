import { Root } from 'protobufjs';

/**
 *
 * @since 1.0.0
 * @param {Object} nestedData
 * @returns {Object}
 * @example
 *
 */

function getProtoRoot(nestedData) {
  if ('onChainMetaData' in nestedData.nested) {
    nestedData = {
      nested: {
        onchainmetadata: {
          ...nestedData.nested.onChainMetaData,
        }
      }
    };
  }
  return Root.fromJSON(nestedData);
}

export default getProtoRoot
