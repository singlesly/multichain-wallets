### 18.08.2022 (Features)
* (Bitcoin, Tron, ETH): Add support virtual balances implementation. Using virtual 
balances to display balance of wallet
* (Feature Toggle): Add `FEATURE_VIRTUAL_BALANCES` - enabled/disabled using virtual balances feautres

### 17.08.2022 (Bug fixes)

* (Bitcoin): Fix bug which used full node wallet balance for make transactions. 
Now using `listunspents` by address filter for correctness behaviour
* (Bitcoin): Add insufficient balance error if list unspents is empty 
* (Bitcoin): handle transaction amount to small error
* (TRON): Handle error invalid address provided on transfer
