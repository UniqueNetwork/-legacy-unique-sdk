import UniqueAPI from '../unique.js';


async function main() {
  const uniqueApi = new UniqueAPI();

  await uniqueApi.init();

  uniqueApi.collectionId = 25;
  uniqueApi.seed = 'cash stomach master leisure glide slot innocent equal toddler pledge clean violin'
  uniqueApi.signer = '5D4Ss8UfaiYCb8ojVbbKfuVjesUqUhA3NsM2zvcsmGgr3UPQ'

  await uniqueApi.updated();

  const token = await uniqueApi.getNftProperties(52);

  console.log(token);
}

main().then(() => process.exit())
.catch((error) => console.error(error));

