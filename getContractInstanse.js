import { ContractPromise } from '@polkadot/api-contract'
/**
 *
 * @since 1.0.0
 * @param {Object} api
 * @param {string | JSON} abi
 * @param {string} marketContractAddress
 * @returns
 * @example
 *
 */
function getContractInstanse(api, abi, marketContractAddress) {
  return new ContractPromise(api, abi, marketContractAddress);
}

export default getContractInstanse
