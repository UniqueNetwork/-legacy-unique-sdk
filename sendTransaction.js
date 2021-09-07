//import {web3FromAddress} from '@polkadot/extension-dapp'

async function sendTransaction(api, sender, transaction, func) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  /*const injector = await web3FromAddress(sender);
  api.setSigner(injector.signer);*/
  return await transaction.signAndSend(sender, func);
}

export default sendTransaction;
