/**
 *
 * @since 1.0.0
 * @param {Object} payload
 * @param {Object} protoRoot
 * @returns {string} hex
 * @example
 */
function serializeNft(payload, protoRoot) {
  const NFTMeta = protoRoot.lookupType("onchainmetadata.NFTMeta");
  const errMsg = NFTMeta.verify(payload);
  if (errMsg) {
    throw Error(errMsg);
  }
  // Create a new message
  const message = NFTMeta.create(payload);
  // Encode a message to an Uint8Array (browser) or Buffer (node)
  return NFTMeta.encode(message).finish();
}

export default serializeNft
