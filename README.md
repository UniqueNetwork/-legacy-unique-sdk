# Unique SDK

## Сборка проекта:

### Установка зависимостей
```bash
yarn install
```

### Разработка
```bash
yarn run start
```

### Cборка
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
Покупка токенов
```js
uniqueApi.collectionId = 112; //Номер коллекции
await uniqueApi.buyOnMarket(53); //Покупка

// or
await uniqueApi.buyOnMarket(53, 113); // token 53, collection 113
```
## cancelOnMarket
Отмена продажи токена
```js
uniqueApi.collectionId = 112;
await uniqueApi.cancelOnMarket(53);

// or
await uniqueApi.cancelOnMarket(53, 113);
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
