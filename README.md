### Cryptocurrency bridge

Provide API for working with BTC & ERC20 wallets.  
Application architecture is flexible and can be scaled for another networks.

### Supported networks and coins

- [X] [Bitcoin](https://developer.bitcoin.org/index.html)
  - [X] BTC
    - [X] Create Wallet (means Bitcoin address in wallet)
    - [X] Get Balance
    - [X] Transfer
    - [X] Estimate Fee  
  

- [X] [Ethereum](https://ethereum.org/en/)
  - [X] ETH
    - [X] Create Wallet (means Account)
    - [X] Get Balance
    - [X] Transfer
    - [X] Estimate Fee
  
- [X] [Tron](https://tron.network/)
  - [X] [TRX](https://tron.network/trx?lng=en)
    - [X] Create Wallet (means Account)
    - [X] Get Balance
    - [ ] Transfer
    - [ ] Estimate Fee
  - [ ] [USDT](https://tron.network/usdt?lng=en)
    - [ ] Create Wallet (means Account)
    - [ ] Get Balance
    - [ ] Transfer
    - [ ] Estimate Fee

- [ ] [TON - The Open Network](https://ton.org/)
  - [ ] TON
    - [ ] Create Wallet
    - [ ] Get Balance
    - [ ] Transfer
    - [ ] Estimate Fee

- [ ] [ZHCash](https://zh.cash/)


### Wallet encryption


When wallet has been created successfully. Application got key pair *public key* & *private key*.  
Public key send via rest api and used for interact with bridge. 
Private key required for sign transaction and we need stored it. But we cannot just write private key into database  
because security reasons. For improve security application implement cipher encryption symmetric algorithm.
After got private key, application use encrypt for it and store to database. 
When bridge need sign transaction in blockchain then application decrypt private key sign tx successfully.

**Please do not modify encryption algorithm and do not change password (env var is CIPHER_PASSWORD) used
to encrypt without complex refactoring and migration otherwise you lost private keys forever**


### Environment variables

`APP_NAME` - is just application name not used. Defined for future in MS arch.  
`CIPHER_PASSWORD` - secret password used for encyption please read - *Wallet encryption* topic for explain details  
`DB_HOST` - database host   
`DB_PORT` - database port  
`DB_USER` - db user  
`DB_PASS` - db pass  
`DB_NAME` - db name  
`BTC_RPC_BASE_URL` - bitcoin daemon rpc url like http://youhost.com:8332  
`BTC_RPC_AUTH_USERNAME` - rpc bitcoin user  
`BTC_RPC_AUTH_PASSWORD` - rpc bitcoin password  
`ETH_RPC_BASE_URL` - Ethereum network rpc url
`TRON_RPC_BASE_URL` - Tron network RPC url
