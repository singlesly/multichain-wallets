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