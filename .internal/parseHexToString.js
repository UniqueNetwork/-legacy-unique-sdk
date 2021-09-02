/**
 *
 * @since 1.0.0
 * @param {string} value
 * @returns string
 * @example
 *
 */
function parseHexToString(value) {
  const source = value.toString().replace('0x', '')
  const buf = Buffer.from(source,'hex')
  return buf.toString('utf8')
}

export default parseHexToString
