import hexToBuffer from "./.internal/hexToBuffer";

/**
 *
 * @since 1.0.0
 * @param {Object} api
 * @param {number} collectionId
 * @param {number} id
 * @returns {Object} {owner, buffer}
 * @example
 */
async function getToken(api, collectionId, id) {
  const token = (await api.query.nft.nftItemList(collectionId, id)).toJSON();
  return {
    owner: token.Owner.toString(),
    buffer: hexToBuffer(token.ConstData.toString())
  }
}

export default getToken
