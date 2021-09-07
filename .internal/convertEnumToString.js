/**
 *
 * @since 1.0.0
 * @param {Object} {value, key, NFTMeta, locale}
 * @returns {string}
 * @example
 */
function convertEnumToString(value, key, NFTMeta, locale) {
  let result = value;

  try {
    const options = NFTMeta?.fields[key]?.resolvedType?.options[value];
    const translationObject = JSON.parse(options);

    if (translationObject && translationObject[locale]) {
      result = translationObject[locale];
    }
  } catch (e) {
    console.error(`Error parsing schema when trying to convert enum to string: ${e}`);
  }
  return result;
}

export default convertEnumToString
