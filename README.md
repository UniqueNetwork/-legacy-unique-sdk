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

  await uniqueApi.buyOnMarket(53); //Покупка
```

## cancelOnMarket
Отмена продажи токена
```js
    async function main() {
      const uniqueApi = new UniqueAPI({
        endPoint: 'wss://testnet2.uniquenetwork.io'
      })
      uniqueApi.marketContractAddress = '5GPbxrVzvjRHUSQUS9BNUFe2Q4KVfsYZtG1CTRaqe51rNSAX'
      uniqueApi.escrowAddress = '5DACuDR8CXXmQS3tpGyrHZXoJ6ds7bjdRb4wVqqSt2CMfAoG'
      uniqueApi.signer = '5D4....'
      uniqueApi.collectionId = 112
      await uniqueApi.connect()
      await uniqueApi.buyOnMarket(53)
    }
    main()
```
## get token
Получения информации об токене
```js
    async function main() {
      const uniqueApi = new UniqueAPI({
        endPoint: 'wss://testnet2.uniquenetwork.io'
      })
      await uniqueApi.connect()
      const token = await uniqueApi.getNftProperties(25, 36)
      console.log(token);
    }
    main()
```

## listOnMarket
Выставления на продажу токен
```js
    async function main() {
      const uniqueApi = new UniqueAPI({
        endPoint: 'wss://testnet2.uniquenetwork.io'
      })
      uniqueApi.marketContractAddress = '5GPbxrVzvjRHUSQUS9BNUFe2Q4KVfsYZtG1CTRaqe51rNSAX'
      uniqueApi.escrowAddress = '5DACuDR8CXXmQS3tpGyrHZXoJ6ds7bjdRb4wVqqSt2CMfAoG'
      uniqueApi.signer = '5D4....'
      uniqueApi.collectionId = 112
      await uniqueApi.connect()
      await uniqueApi.listOnMarket(53,2)
    }
    main()
```
