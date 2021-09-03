import deserializeNft from "./.internal/deserializeNft"
import getProtoRoot from "./.internal/getProtoRoot"
import serializeNft from "./.internal/serializeNft"

/**
 * @since 1.0.0
 * @example
 *
 */
class protoApi {

  #nestedData
  /**
   *
   * @param {Object} nestedData
   *
   */
  constructor(nestedData) {
    this.#nestedData = this.#getProtoRoot(nestedData)
  }

  #getProtoRoot(nestedData) {
    return getProtoRoot(nestedData)
  }
  /**
   *
   * @param {Object} payload
   * @returns
   * @example
   *
   */
  serialize(payload) {
    return serializeNft(payload, this.#nestedData);
  }
  /**
   *
   * @param {string} buffer
   * @param {string} locale
   * @returns {Object}
   * @example
   *
   */
  deserialize(buffer, locale) {
    return deserializeNft({
      buffer, locale, protoRoot: this.#nestedData
    })
  }
}

export default protoApi