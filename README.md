# Unique SDK


Get informantion by token
```js
  const uniqueApi = new UniqueAPI();

  await uniqueApi.init();

  uniqueApi.collectionId = 25;

  await uniqueApi.updated();

  const token = await uniqueApi.getNftProperties(52);

```

List token for sale
```js
  const uniqueApi = new UniqueAPI();

  await uniqueApi.init();

  uniqueApi.escrowAddress = '5DACuDR8CXXmQS3tpGyrHZXoJ6ds7bjdRb4wVqqSt2CMfAoG'
  uniqueApi.marketContractAddress = '5GPbxrVzvjRHUSQUS9BNUFe2Q4KVfsYZtG1CTRaqe51rNSAX';
  uniqueApi.seed = '';
  uniqueApi.signer = '';

  await uniqueApi.updated();

  await uniqueApi.listOnMarket()

```
