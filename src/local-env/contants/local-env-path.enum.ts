export enum LocalEnvPathEnum {
  // MICROSERVICE DEFINITION
  APP_NAME = 'APP_NAME',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_PASSWORD = 'ADMIN_PASSWORD',

  JWT_SECRET = 'JWT_SECRET',

  // APPLICATION CONFIG
  CIPHER_PASSWORD = 'CIPHER_PASSWORD',

  // DATABASE PATHS
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USER = 'DB_USER',
  DB_PASS = 'DB_PASS',
  DB_NAME = 'DB_NAME',

  // BITCOIN NETWORK
  BTC_RPC_AUTH_USERNAME = 'BTC_RPC_AUTH_USERNAME',
  BTC_RPC_AUTH_PASSWORD = 'BTC_RPC_AUTH_PASSWORD',
  BTC_RPC_BASE_URL = 'BTC_RPC_BASE_URL',
  BTC_RPC_API_KEY = 'BTC_RPC_API_KEY',

  // ETHEREUM NETWORK
  ETH_RPC_BASE_URL = 'ETH_RPC_BASE_URL',
  ETH_RPC_AUTH_USERNAME = 'ETH_RPC_AUTH_USERNAME',
  ETH_RPC_AUTH_PASSWORD = 'ETH_RPC_AUTH_PASSWORD',

  // TRON NETWORK
  TRON_RPC_BASE_URL = 'TRON_RPC_BASE_URL',
  TRON_RPC_PRO_API_KEY = 'TRON_RPC_PRO_API_KEY',

  USDT_CONTRACT_ADDRESS = 'USDT_CONTRACT_ADDRESS',

  // FEATURE TOGGLES
  FEATURE_CHECK_OWNERS_PERMISSION = 'FEATURE_CHECK_OWNERS_PERMISSION',
  FEATURE_AUTHENTICATION = 'FEATURE_AUTHENTICATION',
  FEATURE_VIRTUAL_BALANCES = 'FEATURE_VIRTUAL_BALANCES',

  FEATURE_VIRTUAL_TRANSACTIONS = 'FEATURE_VIRTUAL_TRANSACTIONS',
}
