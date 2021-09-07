import UniqueAPI from '../unique.js';


async function main() {
  const uniqueApi = new UniqueAPI()

  await uniqueApi.init()

  uniqueApi.marketContractAddress = '5GPbxrVzvjRHUSQUS9BNUFe2Q4KVfsYZtG1CTRaqe51rNSAX'
  uniqueApi.seed = 'cash stomach master leisure glide slot innocent equal toddler pledge clean violin'
  uniqueApi.signer = '5D4Ss8UfaiYCb8ojVbbKfuVjesUqUhA3NsM2zvcsmGgr3UPQ'

  uniqueApi.collectionId = 112

  await uniqueApi.listOnMarket(22, 0.4);

}

main().then(() => process.exit())
  .catch((error) => console.error(error));
