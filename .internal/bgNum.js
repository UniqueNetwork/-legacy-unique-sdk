import {BigNumber} from 'bignumber.js';

/**
 *
 * @since 1.0.0
 * @param {Object} config
 * @returns
 * @example
 *
 */
function bigNum(config) {
  BigNumber.config(config);
  return BigNumber;
}

export default bigNum;
