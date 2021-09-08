import { Keyring } from '@polkadot/api';
import connect from './connect.js';
import getOnChainSchema from './getOnChainSchema.js';
import getToken from './getToken.js';
import protoApi from './protoApi.js';
import rtt from './runtime_types.json';
import market from './market_metadata.json';
import getAbi from './getAbi.js';
import getContractInstanse from './getContractInstanse.js';
import BigNumber from 'bignumber.js';
import normalizeAccount from './.internal/normalizeAccount.js';
import {web3FromAddress} from '@polkadot/extension-dapp';

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
    this.#seed = this.#keyring.addFromUri(seed);
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
      this.#abi = getAbi(market);
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
  async sendTransaction(transaction, sender, signer) {

    const getTransactionStatus = (events, status) => {
      if (status.isReady) {
        return "NotReady";
      }
      if (status.isBroadcast) {
        return "NotReady";
      }
      if (status.isInBlock || status.isFinalized) {
        const errors = events.filter(e => e.event.data.method === 'ExtrinsicFailed');
        if(errors.length > 0) {
          console.log(`Transaction failed, ${errors}`, 'ERROR');
          return "Fail";
        }
        if(events.filter(e => e.event.data.method === 'ExtrinsicSuccess').length > 0) {
          return "Success";
        }
      }
    };
    return new Promise(async function(resolve, reject) {
      try {
        const injector = await web3FromAddress(signer);
        let unsub = await transaction.signAndSend(signer, {signer: injector.signer} , ({events = [], status}) => {
          const transactionStatus = getTransactionStatus(events, status);

          if (transactionStatus === "Success") {
            console.log(`Transaction successful`);
            resolve(events);
            unsub();
          } else if (transactionStatus === "Fail") {
            console.log(`Something went wrong with transaction. Status: ${status}`);
            reject(events);
            unsub();
          }
        });
      } catch (error) {
        reject(error);
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
    const tx = this.#contractInstance.tx.cancel(
      this.#maxValue,
      this.#maxGas,
      this.collectionId,
      tokenId);

    await this.sendTransaction(tx,  this.seed, this.signer);
  }
  /**
   *
   * @param {number} tokenId
   * @param {number} price
   */
  async listOnMarket(tokenId, price) {
    const priceBN = (new BigNumber(price)).times(1e12).integerValue(BigNumber.ROUND_UP)
    const tx = this.#contractInstance.tx.ask(
      this.#maxValue,
      this.#maxGas,
      this.collectionId,
      tokenId,
      this.#quoteID,
      priceBN.toString()
    )
    await this.sendTransaction(tx,  this.seed, this.signer)
  }
  /**
   *
   * @param {number} tokenId
   */
  async buyOnMarket(tokenId) {
    const tx = this.#api.tx.nft.transfer(
      normalizeAccount(this.escrowAddress),
      this.collectionId,
      tokenId,
      0);
    await this.sendTransaction(tx, this.seed, this.signer);
  }
}

export default UniqueAPI;
