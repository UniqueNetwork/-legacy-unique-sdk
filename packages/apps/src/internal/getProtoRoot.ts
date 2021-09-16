// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ProtobufAttributeType } from '../types';

import { Root } from 'protobufjs';

function getProtoRoot (nestedData: ProtobufAttributeType): Root {
  return Root.fromJSON(nestedData);
}

export default getProtoRoot;
