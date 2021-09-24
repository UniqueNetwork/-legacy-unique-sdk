/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable header/header */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Abi, ContractPromise } from '@polkadot/api-contract';
import type { KeyringPair } from '@polkadot/keyring/types';

import BN from 'bn.js';

import { ApiPromise, Keyring } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { WsProvider } from '@polkadot/rpc-provider';

import BigNumber from './bignumber.js';
import connect from './connect';
import getAbi from './getAbi';
import getContractInstance from './getContractInstance';
import getOnChainSchema from './getOnChainSchema';
import getToken from './getToken';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import market from './market_metadata.json';
import ProtoApi from './protoApi';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import rtt from './runtime_types.json';

class UniqueAPI {
  private _keyring: Keyring;
  private _onChainSchema: any;
  private _collectionId: string | null = null;
  private _seed: KeyringPair | null = null;
  private _signer: any;
  private _api: any;
  private _abi: Abi | null = null;
  private _endpoint: string;
  private _protoApi: any;
  private _marketContractAddress: string;
  private _contractInstance: ContractPromise | null = null;
  private _maxGas: number;
  private _maxValue: number;
  private _quoteID: number;
  private _escrowAddress: string;
  private _commission: number;
  private kusamaParity = 'wss://kusama-rpc.polkadot.io';

  constructor ({ endPoint, escrowAddress, marketContractAddress, maxGas, maxValue, quoteID }: { endPoint?: string, escrowAddress: string, marketContractAddress: string, maxGas?: number, maxValue: number, quoteID: number }) {
    this._keyring = new Keyring({
      type: 'sr25519'
    });

    this._endpoint = endPoint || 'wss://testnet2.uniquenetwork.io';
    this._maxGas = maxGas || 1000000000000;
    this._maxValue = maxValue || 0;
    this._quoteID = quoteID || 2; // KSM
    this._escrowAddress = escrowAddress;
    this._marketContractAddress = marketContractAddress;
    this._commission = 10;

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  set endpoint (endpoint) {
    this._endpoint = endpoint;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  get endpoint () {
    return this._endpoint;
  }

  set collectionId (id) {
    this._collectionId = id;
  }

  get collectionId () {
    return this._collectionId;
  }

  // eslint-disable-next-line accessor-pairs
  set seed (seedPhrase: string) {
    this._seed = this._keyring.addFromUri(seedPhrase);
  }

  /* get seed() {
    return this._seed;
  } */

  set signer (signer) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this._signer = signer;
  }

  get signer () {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._signer;
  }

  get escrowAddress () {
    return this._escrowAddress;
  }

  set escrowAddress (address) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._escrowAddress = address || '';
  }

  set marketContractAddress (contractAddress) {
    this._marketContractAddress = contractAddress;
  }

  get marketContractAddress () {
    return this._marketContractAddress;
  }

  get api () {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._api;
  }

  get contractInstance () {
    return this._contractInstance;
  }

  /**
   *
   */
  async connect () {
    this._api = await connect(this._endpoint, rtt);
  }

  // @todo - rename this
  async updated () {
    if (this._collectionId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this._onChainSchema = await getOnChainSchema(this._api, this._collectionId);
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getMarketPrice (tokenId: string, matcherContract: string = this._escrowAddress, collectionId = this._collectionId): Promise<any> {
    this._abi = getAbi(market);
    this._contractInstance = getContractInstance(
      this._api,
      this._abi,
      this._marketContractAddress
    );

    const askIdResult: any = await this._contractInstance.query.getAskIdByToken(matcherContract, { gasLimit: this._maxGas, value: this._maxValue }, collectionId, tokenId);

    if (askIdResult.output) {
      const askId = askIdResult.output.toNumber();

      if (askId !== 0) {
        const askResult: any = await this._contractInstance.query.getAskById(matcherContract, { gasLimit: this._maxGas, value: this._maxValue }, askId);

        if (askResult.output) {
          const askOwnerAddress = this._keyring.encodeAddress(askResult.output[4].toString());
          const ask = {
            owner: askOwnerAddress,
            price: askResult.output[3]
          };

          return ask;
        }
      }
    }

    return null;
  }

  async getNftProperties (tokenId: string, collectionId = this._collectionId) {
    if (collectionId && tokenId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this._onChainSchema = await getOnChainSchema(this._api, collectionId);
      this._protoApi = new ProtoApi(this._onChainSchema);

      const token = await getToken(this._api, collectionId, tokenId);

      return {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        data: { ...this._protoApi.deserialize(token.buffer, 'en') },
        owner: token.owner
      };
    } else {
      throw new Error('collectionId or tokenId not specified');
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async sendTransactionSeed (transaction, seed) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const getTransactionStatus = (events, status) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (status.isReady) {
        return 'NotReady';
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (status.isBroadcast) {
        return 'NotReady';
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (status.isInBlock || status.isFinalized) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const errors = events.filter((e: { event: { data: { method: string; }; }; }) => e.event.data.method === 'ExtrinsicFailed');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (errors.length > 0) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          console.log(`Transaction failed, ${errors}`, 'ERROR');

          return 'Fail';
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        if (events.filter((e: { event: { data: { method: string; }; }; }) => e.event.data.method === 'ExtrinsicSuccess').length > 0) {
          return 'Success';
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises,no-async-promise-executor
    return new Promise(async function (resolve, reject) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const unsub = await transaction.signAndSend(seed, ({ events = [], status }: { events: any[], status: string }) => {
          const transactionStatus = getTransactionStatus(events, status);

          if (transactionStatus === 'Success') {
            console.log('Transaction successful');
            resolve(events);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            unsub();
          } else if (transactionStatus === 'Fail') {
            console.log(`Something went wrong with transaction. Status: ${status}`);
            reject(events);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            unsub();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async sendTransactionSigner (transaction, signer) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const getTransactionStatus = (events, status) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (status.isReady) {
        return 'NotReady';
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (status.isBroadcast) {
        return 'NotReady';
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (status.isInBlock || status.isFinalized) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const errors = events.filter((e: { event: { data: { method: string; }; }; }) => e.event.data.method === 'ExtrinsicFailed');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (errors.length > 0) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          console.log(`Transaction failed, ${errors}`, 'ERROR');

          return 'Fail';
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        if (events.filter((e: { event: { data: { method: string; }; }; }) => e.event.data.method === 'ExtrinsicSuccess').length > 0) {
          return 'Success';
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises,no-async-promise-executor
    return new Promise(async function (resolve, reject) {
      try {
        const extensions = await web3Enable('polkadot-js/apps');

        if (extensions.length === 0) {
          throw new Error('no extension installed, or the user did not accept the authorization');
        }

        const allAccounts = await web3Accounts();

        if (allAccounts.length === 0) {
          throw new Error('no account');
        }

        const injector = await web3FromAddress(signer);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const unsub = await transaction.signAndSend(signer, { signer: injector.signer }, ({ events = [], status }: { events: any[], status: string }) => {
          const transactionStatus = getTransactionStatus(events, status);

          if (transactionStatus === 'Success') {
            console.log('Transaction successful');
            resolve(events);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            unsub();
          } else if (transactionStatus === 'Fail') {
            console.log(`Something went wrong with transaction. Status: ${status}`);
            reject(events);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            unsub();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async cancelOnMarket (tokenId: string, collectionID = this._collectionId) {
    this._abi = getAbi(market);
    this._contractInstance = getContractInstance(
      this._api,
      this._abi,
      this._marketContractAddress
    );

    if (this._contractInstance) {
      const tx = this._contractInstance.tx.cancel(
        this._maxValue,
        this._maxGas,
        collectionID,
        tokenId);

      if (this._seed) {
        await this.sendTransactionSeed(tx, this._seed);
      } else {
        await this.sendTransactionSigner(tx, this._signer);
      }
    }
  }

  async listOnMarket (tokenId: string, price: number, collectionID = this._collectionId) {
    try {
      const priceBN = (new BigNumber(price)).times(1e12).integerValue(BigNumber.ROUND_UP);

      this._abi = getAbi(market);
      this._contractInstance = getContractInstance(
        this._api,
        this._abi,
        this._marketContractAddress
      );

      if (this._contractInstance) {
        const sendEscrow: boolean = await this.sendToEscrow(tokenId);

        if (sendEscrow) {
          const tx = this._contractInstance.tx.ask(
            this._maxValue,
            this._maxGas,
            collectionID,
            tokenId,
            this._quoteID,
            priceBN.toString()
          );

          if (this._seed) {
            await this.sendTransactionSeed(tx, this._seed);
          } else {
            await this.sendTransactionSigner(tx, this._signer);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async sendToEscrow (tokenId: string, collectionID = this._collectionId): Promise<boolean> {
    try {
      if (!this._api) {
        return false;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      const tx = this._api.tx.nft.transfer(
        this._escrowAddress,
        collectionID,
        tokenId,
        0);

      if (this._seed) {
        await this.sendTransactionSeed(tx, this._seed);
      } else {
        await this.sendTransactionSigner(tx, this._signer);
      }
    } catch (error) {
      console.error(error);

      return false;
    }

    return true;
  }

  getFee (price: BN, commission: number): BN {
    return price.mul(new BN(commission)).div(new BN(100));
  }

  depositNeeded (userDeposit: BN, tokenPrice: BN): BN {
    const feeFull = this.getFee(tokenPrice, this._commission);
    const feePaid = this.getFee(userDeposit, this._commission);
    const fee = feeFull.sub(feePaid);

    return tokenPrice.add(fee).sub(userDeposit);
  }

  isDepositEnough (userDeposit: BN, tokenPrice: BN): boolean {
    const depositNeeded = this.depositNeeded(userDeposit, tokenPrice);

    return !depositNeeded.gtn(0);
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  async getUserDeposit (account: string, contractInstance: ContractPromise): Promise<BN | null> {
    try {
      if (contractInstance) {
        const result: any = await contractInstance.query
          .getBalance(account,
            { gasLimit: this._maxGas, value: 0 }, this._quoteID);

        if (result.output) {
          return result?.output as BN;
        }
      }

      return null;
    } catch (e) {
      console.log('getUserDeposit Error: ', e);

      return null;
    }
  }

  async wait (ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async initKusamaApi (): Promise<ApiPromise> {
    const rtt = {
      DisputeStatementSet: {
        candidateHash: 'CandidateHash',
        session: 'SessionIndex',
        statements: 'Vec<(DisputeStatement, ParaValidatorIndex, ValidatorSignature)>'
      },
      ValidDisputeStatementKind: {
        _enum: {
          Explicit: 'Null',
          BackingSeconded: 'Hash',
          BackingValid: 'Hash',
          ApprovalChecking: 'Null'
        }
      }
    };

    const provider = new WsProvider(this.kusamaParity);
    const api = new ApiPromise({ provider, types: rtt });

    // eslint-disable-next-line @typescript-eslint/require-await
    api.on('disconnected', async (value: any) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`disconnected: ${value}`, 'ERROR');
      process.exit();
    });
    // eslint-disable-next-line @typescript-eslint/require-await
    api.on('error', async (value) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`error: ${value}`, 'ERROR');
      process.exit();
    });

    await api.isReady;

    return api;
  }

  async buyOnMarket (tokenId: string, collectionId = this._collectionId): Promise<any> {
    try {
      this._abi = getAbi(market);
      this._contractInstance = getContractInstance(
        this._api,
        this._abi,
        this._marketContractAddress
      );

      const userDeposit: BN | null = await this.getUserDeposit(this._signer, this._contractInstance);
      const tokenAsk = await this.getMarketPrice(tokenId, this._escrowAddress, collectionId);

      if (userDeposit && tokenAsk && this.isDepositEnough(userDeposit, tokenAsk.price)) {
        console.log('SIGN_SUCCESS');
        const extrinsic = this._contractInstance.tx.buy({
          gasLimit: this._maxGas,
          value: 0
        }, collectionId, tokenId);

        if (this._seed) {
          await this.sendTransactionSeed(extrinsic, this._seed);
        } else {
          await this.sendTransactionSigner(extrinsic, this._signer);
        }
      } else {
        const kusamaApi: ApiPromise = await this.initKusamaApi();
        const needed = this.depositNeeded(userDeposit as BN, tokenAsk.price);

        const kusamaTransfer = kusamaApi.tx.balances.transfer(this._escrowAddress, needed);

        if (this._seed) {
          await this.sendTransactionSeed(kusamaTransfer, this._seed);
        } else {
          await this.sendTransactionSigner(kusamaTransfer, this._signer);
        }

        await this.wait(3000);

        const extrinsic = this._contractInstance.tx.buy({
          gasLimit: this._maxGas,
          value: 0
        }, collectionId, tokenId);

        if (this._seed) {
          await this.sendTransactionSeed(extrinsic, this._seed);
        } else {
          await this.sendTransactionSigner(extrinsic, this._signer);
        }
      }
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}

declare global {
  interface Window {
    UniqueAPI: any
  }
}

window.UniqueAPI = UniqueAPI;

export default UniqueAPI;
