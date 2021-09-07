import proto from 'protobufjs';

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
  return proto.Root.fromJSON(nestedData);
}

export default getProtoRoot
