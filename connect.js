import {ApiPromise, WsProvider} from '@polkadot/api'

/**
 *
 * @since 1.0.0
 * @param {string} [string= '']
 * @param {Object} object
 * @returns {Object}
 * @example
 *
 */
async function connect(endpoint, rtt = '') {
  const wsProvider = new WsProvider(endpoint)
  let api = null;

  if (rtt !== '') {
    api = new ApiPromise({
      provider: wsProvider,
      types: rtt
    })
  } else {
    api = new ApiPromise({
      provider: wsProvider
    })
  }

  try {
    await api.isReady
    return api
  }
  catch (error) {
    console.error(error)
    throw Error(error)
  }
}

export default connect
