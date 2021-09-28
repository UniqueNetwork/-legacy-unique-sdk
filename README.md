# Unique SDK

## build project:

### Install dependencies
```bash
yarn install
```

### start
```bash
yarn run start
```

### build
```bash
yarn run build
```

## API initialization
```js
const createApi = async () => {
  const uniqueApi = new UniqueAPI({
    endPoint: 'wss://testnet2.uniquenetwork.io'
  });
  uniqueApi.marketContractAddress = '5GP...';
  uniqueApi.escrowAddress = '5DA...';
  uniqueApi.signer = '5D4...';

  await uniqueApi.connect();

  return uniqueApi;
}

const uniqueApi = await createApi();
```

## buyOnMarket
buy tokens
```js
uniqueApi.collectionId = 112; //collection number
await uniqueApi.buyOnMarket(53); //buy tokens

// or
await uniqueApi.buyOnMarket(53, 113); // token 53, collection 113
```
## cancelOnMarket
Cancel token sale
```js
uniqueApi.collectionId = 112;
await uniqueApi.cancelOnMarket(53);

// or
await uniqueApi.cancelOnMarket(53, 113);
```

## getNftProperties
get token information
```js
api.collectionId = 112;
let token = await uniqueApi.getNftProperties(25);

// or
token  =  await uniqueApi.getNftProperties(25, 113);
```

## listOnMarket
list token for sale 
```js
uniqueApi.collectionId = 112;
await uniqueApi.listOnMarket(53, 2); // collection 112, token 53, price 2 KSM

// or
await uniqueApi.listOnMarket(53, 2, 112);
```

## getMarketPrice
get token price
```js
uniqueApi.collectionId = 112;
let price = await uniqueApi.getMarketPrice(53);

// or 
price = await uniqueApi.getMarketPrice(53, 112);
```
