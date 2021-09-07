/**
 *
 * @since 1.0.0
 * @param {string} accountId
 * @returns
 * @example
 *
 */
function normalizeAccount (accountId) {
  if (typeof accountId === 'string')
    return { substrate: accountId }
  if ('address' in input) {
    return { substrate: accountId.address };
  }
  if ('ethereum' in input) {
    input.ethereum = input.ethereum.toLowerCase();
    return input;
  }
  if ('substrate' in input) {
    return input
  }

  return {substrate: input.toString()};
}

export default normalizeAccount;
