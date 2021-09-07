import UniqueAPI from '../unique.js';


async function main() {
  const uniqueApi = new UniqueAPI();

  await uniqueApi.init();

  uniqueApi.collectionId = 25;

/*  uniqueApi.escrowAddress = '5DACuDR8CXXmQS3tpGyrHZXoJ6ds7bjdRb4wVqqSt2CMfAoG'
  uniqueApi.marketContractAddress = '5GPbxrVzvjRHUSQUS9BNUFe2Q4KVfsYZtG1CTRaqe51rNSAX';
  uniqueApi.seed = '';
  uniqueApi.signer = '';*/

  await uniqueApi.updated();

  const token = await uniqueApi.getNftProperties(52);

  console.log(token);
}

main().then(() => process.exit())
.catch((error) => console.error(error));

