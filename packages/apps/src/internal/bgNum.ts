// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BigNumber } from '../bignumber.js';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function bigNum (config: any) {
  BigNumber.config(config);

  return BigNumber;
}

export default bigNum;
