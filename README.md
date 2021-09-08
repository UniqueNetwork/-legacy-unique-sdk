# Unique SDK


## buyOnMarket
Покупка токенов
```js
  const uniqueApi = new UniqueAPI() // Вызов библиотеки

  await uniqueApi.init() //Иницилизации соеденения

  uniqueApi.marketContractAddress = '5GPbx...'; //адрес смарт-контракта
  uniqueApi.escrowAddress = '5DAC...'; // адрес escrowAddress
  uniqueApi.seed = '//Alice' //Установка  seed  если планируеться испольввать как backend библиотеку
  uniqueApi.signer = '5D4S...' //Установка владельца

  uniqueApi.collectionId = 112 //Номер коллекции

  await uniqueApi.buyOnMarket(22); //Покупка
```

## cancelOnMarket
Отмена продажи токена
```js
  const uniqueApi = new UniqueAPI()  // Вызов библиотеки

  await uniqueApi.init() //Иницилизации соеденения

  uniqueApi.marketContractAddress = '5GPbx...'; //адрес смарт-контракта
  uniqueApi.escrowAddress = '5DAC...'; // адрес escrowAddress
  uniqueApi.seed = '//Alice' //Установка  seed  если планируеться испольввать как backend библиотеку
  uniqueApi.signer = '5D4S...' //Установка владельца

  uniqueApi.collectionId = 112 //Номер коллекции

  await uniqueApi.cancelOnMarket(22); //Отмены продажи
```
## get token
Получения информации об токене
```js
    const uniqueApi = new UniqueAPI()  // Вызов библиотеки

  await uniqueApi.init() //Иницилизации соеденения

  uniqueApi.collectionId = 112; //Номер коллекции

  await uniqueApi.updated(); //Получения schema для того чтобы разобрать токен

  const token = await uniqueApi.getNftProperties(22); //Вывод токена

  console.log(token);
```

## listOnMarket
Выставления на продажу токен
```js
  const uniqueApi = new UniqueAPI()  // Вызов библиотеки

  await uniqueApi.init() //Иницилизации соеденения

  uniqueApi.marketContractAddress = '5GPbx...'; //адрес смарт-контракта
  uniqueApi.escrowAddress = '5DAC...'; // адрес escrowAddress
  uniqueApi.seed = '//Alice' //Установка  seed  если планируеться испольввать как backend библиотеку
  uniqueApi.signer = '5D4S...' //Установка владельца.'

uniqueApi.collectionId = 112 //Номер коллекции

await uniqueApi.listOnMarket(22, 0.4); //Выставления на продажу токена
```
