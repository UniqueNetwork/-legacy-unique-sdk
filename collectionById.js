/**
 *
 * @since 1.0.0
 * @param {Object} api
 * @param {number} collectionId
 * @returns {Object} Return an JSON view collection
 * @example
 *
 *  await collectionById(api, 2)
 * {
  Owner: "5E9pH6LxGrKfYnyYEMcKTDtB1g7fcrfodZoSNnAdvm1Yu3Cu",
  Mode: {
    nft: null,
  },
  Access: "Normal",
  DecimalPoints: 0,
  Name: [
    67,
    104,
  ],
  Description: [
    85,
    110,
    105,
    113,
    117,
    101,
  ],
  TokenPrefix: "0x4348454c",
  MintMode: false,
  OffchainSchema: "0x68747470733a2f2f697066732d676174657761792e757365746563682e636f6d2f6970",
  SchemaVersion: "ImageURL",
  Sponsorship: {
    confirmed: "5E9pH6LxGrKfYnyYEMcKTDtB1g7fcrfodZoSNnAdvm1Yu3Cu",
  },
  Limits: {
    AccountTokenOwnershipLimit: 10000000,
    SponsoredDataSize: 2048,
    SponsoredDataRateLimit: null,
    TokenLimit: 4294967295,
    SponsorTimeout: 1,
    OwnerCanTransfer: true,
    OwnerCanDestroy: false,
  },
  VariableOnChainSchema: "0x",
  ConstOnChainSchema: "",
}
 * // => { Owner, Mode, Access, Name, Description, TokenPrefix, MintMode }
 */
async function collectionById(api, collectionId) {
  const collection = (await api.query.nft.collectionById(collectionId)).toJSON()
  return collection
}

export default collectionById
