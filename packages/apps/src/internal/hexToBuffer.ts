// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function hexToBuffer (value: string) {
  return Buffer.from(value.replace('0x', ''), 'hex');
}

export default hexToBuffer;
