import { Abi } from '@polkadot/api-contract'

/**
 * @since 1.0.0
 * @param {Object} api
 * @param {JSON} marketContractAbi
 * @returns
 * @example
 *
 */
function getAbi(api, marketContractAbi) {
  return new Abi(api.registry, marketContractAbi);
}

export default getAbi
