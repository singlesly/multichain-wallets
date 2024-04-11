### Get started

[Docker Hub](https://hub.docker.com/r/devsinglesly/multichain-wallets)


1. Create `docker-compose.yaml`  

```yaml
services:
  multichain-wallets:
    image: devsinglesly/multichains-wallets
    environment:
      - CIPHER_PASSWORD=1234
      - DB_HOST=multichain-wallets-postgres
      - DB_PORT=5432
      - DB_NAME=multichain_wallets
      - DB_USER=root
      - DB_PASS=1234
    ports:
      - "3000:3000"
    networks:
      - multichain-wallets

  multichain-wallets-postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=multichain_wallets
      - POSTGRES_USER=root
      - POSTGRES_PASSWORD=1234
    networks:
      - multichain-wallets
```
2. Open `http://localhost:3000/api/docs` to interact with api

### Cryptocurrency bridge

Provide API for working with BTC & ERC20 wallets.  
Application architecture is flexible and can be scaled for another networks.

### Supported networks and coins

| Network                                             |    Tokens     |
|:----------------------------------------------------|:-------------:|
| [Tron](https://tron.network/)                       | Native, TRC20 |
| [Ethereum](https://ethereum.org/en/)                | Native, ERC20 |
| [Bitcoin](https://developer.bitcoin.org/index.html) |    Native     |
| [TON - The Open Network](https://ton.org/)          |    **TDB**    |
| [ZHCash](https://zh.cash/)                          |    **TDB**    |
| [Solana](https://solana.com/)                       |    **TDB**    |
| [Binance Smart Chain](https://bscscan.com/)         |    **TDB**    |

### Wallet encryption


When wallet has been created successfully. Application got key pair *public key* & *private key*.  
Public key send via rest api and used for interact with bridge. 
Private key required for sign transaction and we need stored it. But we cannot just write private key into database  
because security reasons. For improve security application implement cipher encryption symmetric algorithm.
After got private key, application use encrypt for it and store to database. 
When bridge need sign transaction in blockchain then application decrypt private key sign tx successfully.

**Please do not modify encryption algorithm and do not change password (env var is CIPHER_PASSWORD) used
to encrypt without complex refactoring and migration otherwise you lost private keys forever**



