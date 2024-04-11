### Wallet encryption


When wallet has been created successfully. Application got key pair *public key* & *private key*.  
Public key send via rest api and used for interact with bridge.
Private key required for sign transaction and we need stored it. But we cannot just write private key into database  
because security reasons. For improve security application implement cipher encryption symmetric algorithm.
After got private key, application use encrypt for it and store to database.
When bridge need sign transaction in blockchain then application decrypt private key sign tx successfully.

**Please do not modify encryption algorithm and do not change password (env var is CIPHER_PASSWORD) used
to encrypt without complex refactoring and migration otherwise you lost private keys forever**
