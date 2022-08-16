### 17.08.2022 (Bug fixes)

* (Bitcoin) Fix bug which used full node wallet balance for make transactions. 
Now using `listunspents` by address filter for correctness behaviour
* (Bitcoin) Add insufficient balance error if list unspents is empty 
* (Bitcoin) handle transaction amount to small error
