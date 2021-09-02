import parseHexToString from './.internal/parseHexToString'
import collectionById from './collectionById'

/**
 *
 * @since 1.0.0
 * @param {Object} api
 * @param {number} id
 * @returns Object
 * @example
 *
 */
async function getOnChainSchema(api, id) {
  const collection = await collectionById(api, id)
  return JSON.parse(
    parseHexToString(collection.ConstOnChainSchema)
  )
}

export default getOnChainSchema
