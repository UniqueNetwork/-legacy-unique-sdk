import { Keyring } from '@polkadot/api';
import connect from './connect';
import getOnChainSchema from './getOnChainSchema';
import getToken from './getToken';
import protoApi from './protoApi';
import rtt from './runtime_types.json';
import market from './market_metadata.json';

/**
 * @since 1.0.0
 */
class UniqueAPI {

  #keyring = null;
  #endpoint = null;
  #onChainSchema = null;
  #collectionId = null;
  #seed = null;
  #signer = null;
  #api = null;
  #endpoint = 'wss://testnet2.uniquenetwork.io'
  #protoApi = null;

  constructor() {
    this.#keyring = new Keyring({
      type: 'sr25519'
    });
    return this;
  }

  set endpoint(endpoint) {
    this.#endpoint = endpoint
  }

  get endpoint() {
    return this.#endpoint
  }

  set collectionId(id) {
    this.#collectionId = id
  }

  get collectionId() {
    return this.#collectionId
  }

  set seed(seed) {
    this.#seed = this.#keyring.addFromUir(seed);
  }

  get seed() {
    return this.#seed;
  }

  set signer(signer) {
    this.#signer = signer;
  }

  get signer() {
    return this.#signer;
  }
  /**
   *
   */
  async init() {
    this.#api = await connect(this.#endpoint, rtt);
  }

  async updated() {
    if (this.collectionId !== null) {
      this.#onChainSchema = await getOnChainSchema(this.#api, this.#collectionId);
      this.#protoApi = new protoApi(this.#onChainSchema);
    } else {
      throw new Error('please set collectionId');
    }
  }

  /**
   *
   * @param {number} tokenId
   * @param {number} collectionId
   * @returns
   * @example
   *
   */
  async getNftProperties(tokenId, collectionId = this.#collectionId) {
      if (collectionId && this.#onChainSchema) {
          const token = await getToken(this.#api, this.#collectionId, tokenId);
          return {
            owner: token.owner,
            data: {...this.#protoApi.deserialize(token.buffer,'en')}
          }
      } else {
        throw new Error(`not found collecionId`);
      }
  }
}

export default UniqueAPI;
