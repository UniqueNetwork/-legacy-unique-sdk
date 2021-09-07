import { Keyring } from '@polkadot/api';
import connect from './connect.js';
import getOnChainSchema from './getOnChainSchema.js';
import getToken from './getToken.js';
import protoApi from './protoApi.js';
import rtt from './runtime_types.json';
import market from './market_metadata.json';
import sendTransaction from './sendTransaction.js';
import getAbi from './getAbi.js';
import getContractInstanse from './getContractInstanse.js';
import BigNumber from 'bignumber.js';
import normalizeAccount from './.internal/normalizeAccount.js';

/**
 * @since 1.0.0
 */
class UniqueAPI {

  #keyring = null;
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
  #quoteID = 2; // KSM
  #escrowAddress = ''; //escrow

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

  get escrowAddress() {
    return this.#escrowAddress;
  }

  set escrowAddress(address = '') {
    this.#escrowAddress = address;
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

  get api() {
    return this.#api;
  }

  get contractInstance() {
    return this.#contractInstance;
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
  async getNftProperties(tokenId) {
      if (this.#collectionId && this.#onChainSchema) {
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
  /**
   *
   * @param {number} tokenId
   * @param {number} price
   */
  async listOnMarket(tokenId, price) {
    if (typeof tokenId !== number && typeof price !== number) {
      throw new TypeError('Exprected a number')
    }
    const priceBN = (new BigNumber(price)).times(1e12).integerValue(BigNumber.ROUND_UP)
    const tx = this.#contractInstance.tx.ask(
      this.#maxValue,
      this.#maxGas,
      this.#collectionId,
      tokenId,
      this.#quoteID,
      priceBN.toString()
    )
    await this.sendTransaction(tx)
  }
  /**
   *
   * @param {number} tokenId
   */
  async buyOnMarket(tokenId) {
    const tx = this.#api.tx.nft.transfer(
      normalizeAccount(this.escrowAddress),
      this.#collectionId,
      tokenId,
      0);
    await this.sendTransaction(tx);
  }
}

export default UniqueAPI;
