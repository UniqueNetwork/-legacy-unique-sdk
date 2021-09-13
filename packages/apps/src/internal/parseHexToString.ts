/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// [object Object]
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
function parseHexToString (value: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const source: any = value.toString().replace('0x', '');
  const buf = Buffer.from(source, 'hex');

  return buf.toString('utf8');
}

export default parseHexToString;
