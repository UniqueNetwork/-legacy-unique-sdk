# Unique SDK


## buyOnMarket

```js
  const uniqueApi = new UniqueAPI()

  await uniqueApi.init()

  uniqueApi.marketContractAddress = '5GPbx...';
  uniqueApi.escrowAddress = '5DAC...';
  uniqueApi.seed = '//Alice'
  uniqueApi.signer = '5D4S...'

  uniqueApi.collectionId = 112

  await uniqueApi.buyOnMarket(22);
```

## cancelOnMarket
```js
  const uniqueApi = new UniqueAPI()

  await uniqueApi.init()

  uniqueApi.marketContractAddress = '5GPbx...';
  uniqueApi.escrowAddress = '5DAC...';
  uniqueApi.seed = '//Alice'
  uniqueApi.signer = '5D4S...'

  uniqueApi.collectionId = 112

  await uniqueApi.cancelOnMarket(22);
```
## get token
```js
  const uniqueApi = new UniqueAPI();

  await uniqueApi.init();

  uniqueApi.collectionId = 112;

  await uniqueApi.updated();

  const token = await uniqueApi.getNftProperties(22);

  console.log(token);
```

## listOnMarket
```js
const uniqueApi = new UniqueAPI()

await uniqueApi.init()

uniqueApi.marketContractAddress = '5GP...';
uniqueApi.escrowAddress = '5DACu...';
uniqueApi.seed = '//Alice'
uniqueApi.signer = '5D...'

uniqueApi.collectionId = 112

await uniqueApi.listOnMarket(22);
```
