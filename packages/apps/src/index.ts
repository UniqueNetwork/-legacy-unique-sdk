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

  private async sendTransactionSeed (transaction: any, seed: KeyringPair, getStatus: (events: any, status: any) => string | null): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      return new Promise(async (resolve, reject) => {
        const unsub = await transaction.signAndSend(seed,
          ({ events = [], status }: { events: any[], status: string }) => {
            const transactionStatus = getStatus(events, status);

            if (transactionStatus === 'Success') {
              console.log('Transaction successful');
              resolve(true);
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              unsub();
            } else if (transactionStatus === 'Fail') {
              console.log(`Something went wrong with transaction. Status: ${status}`);
              console.log(events);
              // eslint-disable-next-line prefer-promise-reject-errors
              reject(false);
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              unsub();
            }
          });
      });
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  private getStatus (events: any, status: any): string | null {
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

    return null;
  }

  private getContract (): ContractPromise {
    this._abi = getAbi(market);

    return getContractInstance(
      this._api,
      this._abi,
      this._marketContractAddress
    );
  }

  private async sendTransactionSig (transaction: any, signer: string, getStatus: (events: any, status: any) => string | null): Promise<boolean> {
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

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      return new Promise(async (resolve, reject) => {
        const unsub = await transaction.signAndSend(signer, { signer: injector.signer }, ({ events = [], status }: { events: any[], status: string }) => {
          const transactionStatus = getStatus(events, status);

          if (transactionStatus === 'Success') {
            console.log('Transaction successful');
            console.log(events);
            resolve(true);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            unsub();
          } else if (transactionStatus === 'Fail') {
            console.log(`Something went wrong with transaction. Status: ${status}`);
            // eslint-disable-next-line prefer-promise-reject-errors
            console.log(events);
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(false);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            unsub();
          }
        });
      });
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  private async sendSign (transaction: any, signer: string, seed: KeyringPair | null, getStatus: (events: any, status: any) => string | null): Promise<boolean> {
    let status = false;

    if (seed) {
      status = await this.sendTransactionSeed(transaction, seed, getStatus);
    } else {
      status = await this.sendTransactionSig(transaction, signer, getStatus);
    }

    return status;
  }

  private async sendToEscrow (tokenId: string, collectionID = this._collectionId): Promise<boolean> {
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

      return await this.sendSign(tx, this._signer, this._seed, this.getStatus);
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  private getFee (price: BN, commission: number): BN {
    return price.mul(new BN(commission)).div(new BN(100));
  }

  private depositNeeded (userDeposit: BN, tokenPrice: BN): BN {
    const feeFull = this.getFee(tokenPrice, this._commission);
    const feePaid = this.getFee(userDeposit, this._commission);
    const fee = feeFull.sub(feePaid);

    return tokenPrice.add(fee).sub(userDeposit);
  }

  private isDepositEnough (userDeposit: BN, tokenPrice: BN): boolean {
    const depositNeeded = this.depositNeeded(userDeposit, tokenPrice);

    return !depositNeeded.gtn(0);
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  private async getUserDeposit (account: string, contractInstance: ContractPromise): Promise<BN | null> {
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

  private async wait (ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   *
   */
  async connect () {
    this._api = await connect(this._endpoint, rtt);
  }

  // @todo - rename this
  async updated (collectionID = this._collectionId): Promise<void> {
    if (collectionID) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this._onChainSchema = await getOnChainSchema(this._api, collectionID);
      this._protoApi = new ProtoApi(this._onChainSchema);
    } else {
      throw new Error('please set collectionId');
    }
  }

  /**
   * @param {string} collectionId
   * @param {string} tokenId
   * @param {string} matcherContract
   * @return {{ owner: string, price: BN }} {}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getMarketPrice (tokenId: string, matcherContract: string = this._escrowAddress, collectionId = this._collectionId): Promise<any> {
    const contractInstance: ContractPromise = this.getContract();

    const askIdResult: any = await contractInstance.query.getAskIdByToken(matcherContract, { gasLimit: this._maxGas, value: this._maxValue }, collectionId, tokenId);

    if (askIdResult.output) {
      const askId = askIdResult.output.toNumber();

      if (askId !== 0) {
        const askResult: any = await contractInstance.query.getAskById(matcherContract, { gasLimit: this._maxGas, value: this._maxValue }, askId);

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

  async getNftProperties (tokenId: string, collectionId = this._collectionId): Promise<any> {
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

  async cancelOnMarket (tokenId: string, collectionID = this._collectionId): Promise<boolean> {
    const contractInstance: ContractPromise = this.getContract();

    if (contractInstance) {
      const tx = contractInstance.tx.cancel(
        this._maxValue,
        this._maxGas,
        collectionID,
        tokenId);

      return await this.sendSign(tx, this._signer, this._seed, this.getStatus);
    }

    return false;
  }

  async listOnMarket (tokenId: string, price: number, collectionID = this._collectionId): Promise<boolean> {
    const priceBN = (new BigNumber(price)).times(1e12).integerValue(BigNumber.ROUND_UP);
    const contractInstance: ContractPromise = this.getContract();

    if (contractInstance) {
      const sendEscrow: boolean = await this.sendToEscrow(tokenId);

      if (sendEscrow) {
        const tx = contractInstance.tx.ask(
          this._maxValue,
          this._maxGas,
          collectionID,
          tokenId,
          this._quoteID,
          priceBN.toString()
        );

        return await this.sendSign(tx, this._signer, this._seed, this.getStatus);
      }

      return false;
    }

    return false;
  }

  private async initKusamaApi (): Promise<ApiPromise> {
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

  private async kusamaTranser (needed: BN): Promise<boolean> {
    try {
      const kusamaApi: ApiPromise = await this.initKusamaApi();
      const kusamaTransfer = kusamaApi.tx.balances.transfer(this._escrowAddress, needed);

      return this.sendSign(kusamaTransfer, this._signer, this._seed, this.getStatus);
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  async buyOnMarket (tokenId: string, collectionId = this._collectionId): Promise<boolean> {
    try {
      const contractInstance: ContractPromise = this.getContract();
      let userDeposit: BN | null = await this.getUserDeposit(this._signer, contractInstance);
      const tokenAsk = await this.getMarketPrice(tokenId, this._escrowAddress, collectionId);

      if (userDeposit && tokenAsk && this.isDepositEnough(userDeposit, tokenAsk.price)) {
        const extrinsic = contractInstance.tx.buy({
          gasLimit: this._maxGas,
          value: 0
        }, collectionId, tokenId);

        return await this.sendSign(extrinsic, this._signer, this._seed, this.getStatus);
      } else {
        const needed = this.depositNeeded(userDeposit as BN, tokenAsk.price);
        const isTransfer = await this.kusamaTranser(needed);

        if (isTransfer) {
          let result = false;
          let counter = 0;

          do {
            await this.wait(2000);
            userDeposit = await this.getUserDeposit(this._signer, contractInstance);
            result = this.isDepositEnough(userDeposit as BN, tokenAsk.price);

            if (result === true) {
              const extrinsic = contractInstance.tx.buy({
                gasLimit: this._maxGas,
                value: 0
              }, collectionId, tokenId);

              await this.sendSign(extrinsic, this._signer, this._seed, this.getStatus);
            }

            counter = counter + 1;

            if (counter === 120) {
              result = true;
            }
          } while (result === false);

          console.log(result);

          if (counter === 120) {
            return false;
          } else {
            return true;
          }
        }

        return false;
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
