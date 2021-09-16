//[object Object]
// SPDX-License-Identifier: Apache-2.0

import type { Abi, ContractPromise } from '@polkadot/api-contract';
import type { KeyringPair } from '@polkadot/keyring/types';

import { Keyring } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';

// @ts-ignore
import BigNumber from './bignumber.js';
// @ts-ignore
import connect from './connect';
import getAbi from './getAbi';
import getContractInstance from './getContractInstance';
import getOnChainSchema from './getOnChainSchema';
// @ts-ignore
import getToken from './getToken';
// @ts-ignore
import market from './market_metadata.json';
import ProtoApi from './protoApi';
// @ts-ignore
import rtt from './runtime_types.json';


/**
 * @since 1.0.0
 */
class UniqueAPI {

  _keyring: Keyring;
  _onChainSchema: any;
  _collectionId: string | null = null;
  _seed: KeyringPair | null = null;
  _signer: any;
  _api: any;
  _abi: Abi | null = null;
  _endpoint: string;
  _protoApi: any;
  _marketContractAddress: string;
  _contractInstance: ContractPromise | null = null;
  _maxGas: number;
  _maxValue: number;
  _quoteID: number;
  _escrowAddress: string;

  constructor({ endPoint, escrowAddress, marketContractAddress, maxGas, maxValue, quoteID }: { endPoint?: string, escrowAddress: string, marketContractAddress: string, maxGas?: number, maxValue: number, quoteID: number }) {
    this._keyring = new Keyring({
      type: 'sr25519'
    });

    this._endpoint = endPoint || 'wss://testnet2.uniquenetwork.io';
    this._maxGas = maxGas || 1000000000000;
    this._maxValue = maxValue || 0;
    this._quoteID = quoteID || 2; // KSM
    this._escrowAddress = escrowAddress;
    this._marketContractAddress = marketContractAddress;

    return this;
  }

  set endpoint(endpoint) {
    this._endpoint = endpoint
  }

  get endpoint() {
    return this._endpoint
  }

  set collectionId(id) {
    this._collectionId = id
  }

  get collectionId() {
    return this._collectionId
  }

  set seed(seedPhrase: string) {
    this._seed = this._keyring.addFromUri(seedPhrase);
  }

  /* get seed() {
    return this._seed;
  } */

  set signer(signer) {
    this._signer = signer;
  }

  get signer() {
    return this._signer;
  }

  get escrowAddress() {
    return this._escrowAddress;
  }

  set escrowAddress(address) {
    // @ts-ignore
    this._escrowAddress = address || '';
  }

  set marketContractAddress(contractAddress) {
    this._marketContractAddress = contractAddress;
    if (this._api) {
      this._abi = getAbi(market);
      this._contractInstance = getContractInstance(
        this._api,
        this._abi,
        this._marketContractAddress
        );
    }
  }

  get marketContractAddress() {
    return this._marketContractAddress;
  }

  get api() {
    return this._api;
  }

  get contractInstance() {
    return this._contractInstance;
  }
  /**
   *
   */
  async connect(endpoint: string) {
    this._endpoint = endpoint;
    this._api = await connect(this._endpoint, rtt);
  }

  // @todo - rename this
  async updated() {
    if (this._collectionId) {
      this._onChainSchema = await getOnChainSchema(this._api, this._collectionId);
      console.log('_onChainSchema', this._onChainSchema);
      this._protoApi = new ProtoApi(this._onChainSchema);
    } else {
      throw new Error('please set collectionId');
    }
  }

  // @todo - add getMarketPrice method
  /**
   * @param {string} collectionId
   * @param {string} tokenId
   * @param {string} matcherContract
   * @return {{ owner: string, price: BN }} {}
   */
  async getMarketPrice(collectionId: string, tokenId: string, matcherContract: string) {
    /* this code is from marketplace
    const jsonAbi = new Abi(metadata, api.registry.getChainProperties());
    const newContractInstance = new ContractPromise(api, jsonAbi, contractAddress);

    if (contractInstance) {
      const askIdResult = await contractInstance.query.getAskIdByToken(contractAddress, { gasLimit: maxGas, value }, collectionId, tokenId) as unknown as { output: BN };

      if (askIdResult.output) {
        const askId = askIdResult.output.toNumber();

        if (askId !== 0) {
          const askResult = await contractInstance.query.getAskById(contractAddress, { gasLimit: maxGas, value }, askId) as unknown as AskOutputInterface;

          if (askResult.output) {
            const askOwnerAddress = keyring.encodeAddress(askResult.output[4].toString());

            const ask = {
              owner: askOwnerAddress,
              price: askResult.output[3]
            };

            setTokenAsk(ask);

            return ask;
          }
        }
      }
    }
     */
  }

  /**
   *
   * @param {number} tokenId
   * @param {number} collectionId
   * @returns
   * @example
   *
   */
  async getNftProperties(collectionId: string, tokenId: string) {
      if (collectionId && tokenId) {
          this._onChainSchema = await getOnChainSchema(this._api, collectionId);

          const token = await getToken(this._api, collectionId, tokenId);

        return {
            owner: token.owner,
            // @ts-ignore
            data: { ...this._protoApi.deserialize(token.buffer,'en') }
          }
      } else {
        throw new Error(`collectionId or tokenId not specified`);
      }
  }

  /**
   *
   * @param {*} transaction
   * @param sender
   * @param signer
   * @returns
   * @example
   *
   */
  // @ts-ignore
  async sendTransaction(transaction, sender, signer) {

    // @ts-ignore
    const getTransactionStatus = (events, status) => {
      if (status.isReady) {
        return "NotReady";
      }
      if (status.isBroadcast) {
        return "NotReady";
      }
      if (status.isInBlock || status.isFinalized) {
        const errors = events.filter((e: { event: { data: { method: string; }; }; }) => e.event.data.method === 'ExtrinsicFailed');
        if(errors.length > 0) {
          console.log(`Transaction failed, ${errors}`, 'ERROR');
          return "Fail";
        }
        if(events.filter((e: { event: { data: { method: string; }; }; }) => e.event.data.method === 'ExtrinsicSuccess').length > 0) {
          return "Success";
        }
      }
    };

    return new Promise(async function(resolve, reject) {
      try {
        const injector = await web3FromAddress(signer);
        let unsub = await transaction.signAndSend(signer, {signer: injector.signer} , ({ events = [], status }: { events: any[], status: string }) => {
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
  async cancelOnMarket(tokenId: string) {
    if (this._contractInstance) {
      const tx = this._contractInstance.tx.cancel(
        this._maxValue,
        this._maxGas,
        this._collectionId,
        tokenId);

      await this.sendTransaction(tx,  this._seed, this._signer);
    }
  }
  /**
   *
   * @param {number} tokenId
   * @param {number} price
   */
  async listOnMarket(tokenId: string, price: number) {
    const priceBN = (new BigNumber(price)).times(1e12).integerValue(BigNumber.ROUND_UP)
    const tx = this._contractInstance?.tx?.ask(
      this._maxValue,
      this._maxGas,
      this._collectionId,
      tokenId,
      this._quoteID,
      priceBN.toString()
    )
    await this.sendTransaction(tx,  this.seed, this.signer)
  }
  /**
   *
   * @param {number} tokenId
   */
  async buyOnMarket(tokenId: string) {
    if (!this._api) {
      return;
    }

    const tx = this._api.tx.nft.transfer(
      this._escrowAddress,
      this._collectionId,
      tokenId,
      0);
    await this.sendTransaction(tx, this._seed, this._signer);
  }
}

export default UniqueAPI;
