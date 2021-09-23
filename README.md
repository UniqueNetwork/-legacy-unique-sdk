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


## buyOnMarket
Покупка токенов
```js
  const uniqueApi = new UniqueAPI({
        endPoint: 'wss://testnet2.uniquenetwork.io'
      }) // Вызов библиотеки
  uniqueApi.marketContractAddress = '5GPbxrVzvjRHUSQUS9BNUFe2Q4KVfsYZtG1CTRaqe51rNSAX'
  uniqueApi.escrowAddress = '5DACuDR8CXXmQS3tpGyrHZXoJ6ds7bjdRb4wVqqSt2CMfAoG'
  uniqueApi.signer = '5D4....'
  uniqueApi.collectionId = 112 //Номер коллекции
  await uniqueApi.connect()
  await uniqueApi.buyOnMarket(53); //Покупка
```
Другой вариант
```js
  const uniqueApi = new UniqueAPI({
        endPoint: 'wss://testnet2.uniquenetwork.io'
      }) // Вызов библиотеки
  uniqueApi.marketContractAddress = '5GPbxrVzvjRHUSQUS9BNUFe2Q4KVfsYZtG1CTRaqe51rNSAX'
  uniqueApi.escrowAddress = '5DACuDR8CXXmQS3tpGyrHZXoJ6ds7bjdRb4wVqqSt2CMfAoG'
  uniqueApi.signer = '5D4....'
  await uniqueApi.connect()
  await uniqueApi.buyOnMarket(53, 112); //Покупка
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
      await uniqueApi.cancelOnMarket(53)
    }
    main()
```
Другой вариант
```js
      const uniqueApi = new UniqueAPI({
        endPoint: 'wss://testnet2.uniquenetwork.io'
      })
      uniqueApi.marketContractAddress = '5GPbxrVzvjRHUSQUS9BNUFe2Q4KVfsYZtG1CTRaqe51rNSAX'
      uniqueApi.escrowAddress = '5DACuDR8CXXmQS3tpGyrHZXoJ6ds7bjdRb4wVqqSt2CMfAoG'
      uniqueApi.signer = '5D4....'
      await uniqueApi.connect()
      await uniqueApi.cancelOnMarket(53, 112)
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
Другой вариант
```js
    async function main() {
      const uniqueApi = new UniqueAPI({
        endPoint: 'wss://testnet2.uniquenetwork.io'
      })
      uniqueApi.collectionId = 112
      await uniqueApi.connect()
      const token = await uniqueApi.getNftProperties(25)
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
Другой вариант
```js
    async function main() {
      const uniqueApi = new UniqueAPI({
        endPoint: 'wss://testnet2.uniquenetwork.io'
      })
      uniqueApi.marketContractAddress = '5GPbxrVzvjRHUSQUS9BNUFe2Q4KVfsYZtG1CTRaqe51rNSAX'
      uniqueApi.escrowAddress = '5DACuDR8CXXmQS3tpGyrHZXoJ6ds7bjdRb4wVqqSt2CMfAoG'
      uniqueApi.signer = '5D4....'
      await uniqueApi.connect()
      await uniqueApi.listOnMarket(53,2, 112)
    }
    main()
```
### getMarketPrice
```js
    async function main() {
      const uniqueApi = new UniqueAPI({
        endPoint: 'wss://testnet2.uniquenetwork.io'
      })
      uniqueApi.marketContractAddress = '5GPbxrVzvjRHUSQUS9BNUFe2Q4KVfsYZtG1CTRaqe51rNSAX'
      uniqueApi.escrowAddress = '5DACuDR8CXXmQS3tpGyrHZXoJ6ds7bjdRb4wVqqSt2CMfAoG'
      uniqueApi.signer = '5F9u...'
      uniqueApi.collectionId = 112
      await uniqueApi.connect()
      const price = await uniqueApi.getMarketPrice(53)
      console.log(price)
    }
    main()
```
Другой вариант:
```js
    async function main() {
      const uniqueApi = new UniqueAPI({
        endPoint: 'wss://testnet2.uniquenetwork.io'
      })
      uniqueApi.marketContractAddress = '5GPbxrVzvjRHUSQUS9BNUFe2Q4KVfsYZtG1CTRaqe51rNSAX'
      uniqueApi.signer = '5F9u...'
      uniqueApi.collectionId = 112
      await uniqueApi.connect()
      const price = await uniqueApi.getMarketPrice(53, '5DACuDR8CXXmQS3tpGyrHZXoJ6ds7bjdRb4wVqqSt2CMfAoG')
      console.log(price)
    }
    main()
```
