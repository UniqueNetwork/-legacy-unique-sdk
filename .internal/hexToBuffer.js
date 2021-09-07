/**
 *
 * @since 1.0.0
 * @param {string} value
 * @returns {Buffer}
 * @example
 *
 */
function hexToBuffer(value) {
  return Buffer(value.replace('0x',''), 'hex');
}

export default hexToBuffer;
