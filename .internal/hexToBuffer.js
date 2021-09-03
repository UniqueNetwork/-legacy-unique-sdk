/**
 *
 * @since 1.0.0
 * @param {string} value
 * @returns {Buffer}
 * @example
 *
 */
function hexToBuffer(value) {
  if (value instanceof String) {
    return Buffer(value.replace('0x',''), 'hex');
  } else {
    return value;
  }
}

export default hexToBuffer;
