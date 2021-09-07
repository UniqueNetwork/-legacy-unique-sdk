import convertEnumToString from "./convertEnumToString.js";

/**
 *
 * @since 1.0.0
 * @param {Object} {buffer, locale, protoRoot}
 * @returns
 * @example
 *
 */
function deserializeNft({buffer, locale, protoRoot}) {
  const NFTMeta = protoRoot.lookupType("onchainmetadata.NFTMeta");
  const message = NFTMeta.decode(buffer);
  const originalObject = NFTMeta.toObject(message);

  const parseObject = NFTMeta.toObject(message, {
      enums: String, // enums as string names
      longs: String, // longs as strings (requires long.js)
      bytes: Array, // bytes as base64 encoded strings
      defaults: true, // includes default values
      arrays: true, // populates empty arrays (repeated fields) even if defaults=false
      objects: true, // populates empty objects (map fields) even if defaults=false
      oneofs: true,
  });

  const mappingObject = Object.fromEntries(
      Object.keys(originalObject).map((key) => [key, parseObject[key]])
  );

  for (const key in mappingObject) {
    if (NFTMeta.fields[key].resolvedType === null) {
      continue;
    }
    if (NFTMeta.fields[key].resolvedType.constructor.name == "Enum") {
      if (Array.isArray(mappingObject[key])) {
        const items = mappingObject[key];
        items.forEach((item, index) => {
          mappingObject[key][index] = convertEnumToString(
            mappingObject[key][index],
            key,
            NFTMeta,
            locale
          );
        });
      } else {
        mappingObject[key] = convertEnumToString(
          mappingObject[key],
          key,
          NFTMeta,
          locale
        );
      }
    }
  }
  return mappingObject;
}

export default deserializeNft;
