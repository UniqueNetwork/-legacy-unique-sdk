// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export type SchemaVersionTypes = 'ImageURL' | 'Unique';

export type FieldType = 'string' | 'enum';

export type FieldRuleType = 'optional' | 'required' | 'repeated';

export type AttributeItemType = {
  id?: number,
  fieldType: FieldType;
  name: string;
  rule: FieldRuleType;
  values: string[];
}

export type EnumElemType = { options: { [key: string]: string}, values: { [key: string]: number } };
export type NFTMetaType = {
  fields: {
    [key: string]: {
      id: number;
      rule: FieldRuleType;
      type: string;
    }
  }
}

export type ProtobufAttributeType = {
  nested: {
    onChainMetaData: {
      nested: {
        [key: string]: {
          fields?: {
            [key: string]: {
              id: number;
              rule: FieldRuleType;
              type: string;
            }
          }
          options?: { [key: string]: string };
          values?: { [key: string]: number };
        }
      }
    }
  }
}

export interface TokenDetailsInterface {
  Owner: any[];
  ConstData: string;
  VariableData?: string;
}

export interface NftCollectionInterface {
  Access?: 'Normal' | 'WhiteList'
  id: string;
  DecimalPoints: BN | number;
  Description: number[];
  TokenPrefix: string;
  MintMode?: boolean;
  Mode: {
    nft: null;
    fungible: null;
    reFungible: null;
    invalid: null;
  };
  Name: number[];
  OffchainSchema: string;
  Owner?: string;
  SchemaVersion: SchemaVersionTypes;
  Sponsorship: {
    confirmed?: string;
    disabled?: string | null;
    unconfirmed?: string | null;
  };
  Limits?: {
    AccountTokenOwnershipLimit: string;
    SponsoredDataSize: string;
    SponsoredDataRateLimit: string;
    SponsoredMintSize: string;
    TokenLimit: string;
    SponsorTimeout: string;
    OwnerCanTransfer: boolean;
    OwnerCanDestroy: boolean;
  },
  VariableOnChainSchema: string;
  ConstOnChainSchema: string;
}
