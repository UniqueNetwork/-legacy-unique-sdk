import UniqueAPI from '../unique.js';


async function main() {
  const uniqueApi = new UniqueAPI()

  await uniqueApi.init()

  uniqueApi.marketContractAddress = '5GP...';
  uniqueApi.escrowAddress = '5DACu...';
  uniqueApi.seed = '//Alice'
  uniqueApi.signer = '5D...'

  uniqueApi.collectionId = 112

  await uniqueApi.listOnMarket(22);

}

main().then(() => process.exit())
  .catch((error) => console.error(error));
