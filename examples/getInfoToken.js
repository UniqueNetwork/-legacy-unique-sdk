import UniqueAPI from '../unique.js';


async function main() {
  const uniqueApi = new UniqueAPI();

  await uniqueApi.init();

  uniqueApi.collectionId = 25;

  await uniqueApi.updated();

  const token = await uniqueApi.getNftProperties(52);

  console.log(token);
}

main().then(() => process.exit())
.catch((error) => console.error(error));
