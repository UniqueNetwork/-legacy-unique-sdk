// [object Object]
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
import { Type } from 'protobufjs';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function convertEnumToString (value: string, key: string, NFTMeta: Type, locale: string) {
  let result = value;

  try {
    const options = NFTMeta?.fields[key]?.resolvedType?.options as {[key: string]: string};
    const valueJsonComment = options[value];
    const translationObject = JSON.parse(valueJsonComment) as {[key: string]: string};

    if (translationObject && (translationObject[locale])) {
      result = translationObject[locale];
    }
  } catch (e) {
    console.log('Error parsing schema when trying to convert enum to string: ', e);
  }

  return result;
}

export default convertEnumToString;
