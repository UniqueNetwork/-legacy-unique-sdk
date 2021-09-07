import UniqueAPI from '../unique.js';


async function main() {
  const uniqueApi = new UniqueAPI()

  await uniqueApi.init()

  uniqueApi.marketContractAddress = '5GPbx...';
  uniqueApi.escrowAddress = '5DAC...';
  uniqueApi.seed = '//Alice'
  uniqueApi.signer = '5D4S...'

  uniqueApi.collectionId = 112

  await uniqueApi.cancelOnMarket(22);

}

main().then(() => process.exit())
  .catch((error) => console.error(error));
