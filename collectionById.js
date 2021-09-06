/**
 *
 * @since 1.0.0
 * @param {Object} api
 * @param {number} collectionId
 * @returns {Object} Return an JSON view collection
 * @example
 *
 *  await collectionById(api, 2)
 * // => { Owner, Mode, Access, Name, Description, TokenPrefix, MintMode }
 */
async function collectionById(api, collectionId) {
  if (typeof collectionById !== number) {
    throw new TypeError('Expected a number');
  }
  const collection = (await api.query.nft.collectionById(collectionId)).toJSON()
  return collection
}

export default collectionById
