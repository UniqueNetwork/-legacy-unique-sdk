import { Keyring } from '@polkadot/api';
import connect from './connect';
import getOnChainSchema from './getOnChainSchema';
import getToken from './getToken';
import protoApi from './protoApi';
import rtt from './runtime_types.json';
import market from './market_metadata.json';
import sendTransaction from './sendTransaction';
import getAbi from './getAbi';
import getContractInstanse from './getContractInstanse';

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
  #abi = null;
  #endpoint = 'wss://testnet2.uniquenetwork.io'
  #protoApi = null;
  #marketContractAddress = null;
  #contractInstance = null;
  #maxGas = 1000000000000;
  #maxValue = 0;

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

  set marketContractAddress(contractAddress) {
    this.#marketContractAddress = contractAddress;
    if (this.#api) {
      this.#abi = getAbi(this.#api, market);
      this.#contractInstance = getContractInstanse(
        this.#api,
        this.#abi,
        this.#marketContractAddress
        );
    }
  }

  get marketContractAddress() {
    return this.#marketContractAddress;
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
  /**
   *
   * @param {*} transaction
   * @returns
   * @example
   *
   */
  async sendTransaction(transaction) {
    const unsub = await sendTransaction(
      this.#api,
      this.signer,
      transaction,
      ({ events = [], status }) => {
        if (status == 'Ready') {
          console.log(`Current tx status is Ready`)

        } else if (JSON.parse(status).Broadcast) {
          console.log(`Current tx status is Broadcast`)

        } else if (status.isInBlock) {
          console.log(`Transaction included at blockHash ${status.asInBlock}`)
        } else if (status.isFinalized) {
          console.log(`Transaction finalized at blockHash ${status.asFinalized}`)

          let success = false;

          events.forEach(
            (
              {
                phase,
                event: { data, method, section }
              }
            ) => {
              console.log(`${phase}: ${section}.${method}:: ${data}`);
              if (method == 'ExtrinsicSuccess') {
                success = true;
              }
            }
          );
          unsub();
        } else {
          console.log(`Something went wrong with transaction. Status: ${status}`);
          unsub();
        }
      });
  }
  /**
   *
   * @since 1.0.0
   * @param {number} tokenId
   * @examples
   *
   */
  async cancelOnMarket(tokenId) {
    if (typeof tokenId !== number) {
      throw new TypeError('Expected a number');
    }
    const tx = this.#contractInstance.tx.cancel(
      this.#maxValue,
      this.#maxGas,
      this.#collectionId,
      tokenId);

    await this.sendTransaction(tx);
  }

  async listOnMarket() {

  }

  async buyOnMarket() {

  }
}

export default UniqueAPI;
