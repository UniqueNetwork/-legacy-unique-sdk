# Unique SDK

Unique Network is a scalable blockchain for composable NFTs with advanced economies — The NFT chain built for Polkadot and Kusama.
This is an SDK for working with Unique Network.
Unfortunately, the SDK needs to be built for the project. :pensive:
We are aware of this and will fix it in the next version. :smiley:

## Building a project:

### Installing
You need to do the installation of npm packages for the next build of the project.
```bash
yarn install
```
or
```bash
npm install
```

### Building a project
The project will be compiled from typescript scripts. The compiled files will be stored here `/packages/apps/build`
```bash
yarn run build
```

## API initialization
The Unique API object is global, and is added to the windows object.
```js
const createApi = async () => {
  const uniqueApi = new UniqueAPI({
    endPoint: 'wss://testnet2.uniquenetwork.io' //Network address
  });
  uniqueApi.marketContractAddress = '5GP...'; //The address of the contract, you need if you will buy or sell tokens.
  uniqueApi.escrowAddress = '5DA...'; //The escrow address is needed for the purchase and sale of tokens
  uniqueApi.signer = '5D4...';  //Your address in polkadot.js

  await uniqueApi.connect();

  return uniqueApi;
}

const uniqueApi = await createApi();
```

## buyOnMarket
Buy of a token. To buy a token, calls the method `buyOnMarket`
```js
uniqueApi.collectionId = 112; //Collection number
await uniqueApi.buyOnMarket(53);
```
## cancelOnMarket
Cancellation token
```js
uniqueApi.collectionId = 112;
await uniqueApi.cancelOnMarket(53);
```

## getNftProperties
Получения информации об токене
```js
api.collectionId = 112;
let token = await uniqueApi.getNftProperties(25);

// or
token  =  await uniqueApi.getNftProperties(25, 113);
```

## listOnMarket
Выставления на продажу токен
```js
uniqueApi.collectionId = 112;
await uniqueApi.listOnMarket(53, 2); // collection 112, token 53, price 2 KSM

// or
await uniqueApi.listOnMarket(53, 2, 112);
```

## getMarketPrice
```js
uniqueApi.collectionId = 112;
let price = await uniqueApi.getMarketPrice(53);

// or
price = await uniqueApi.getMarketPrice(53, 112);
```
