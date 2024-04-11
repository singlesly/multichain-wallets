### Requirements
* Docker

Execute bash command
```bash
wget -qO- https://raw.githubusercontent.com/singlesly/multichain-wallets/main/production/docker/install.sh | bash
```  

Check running open - `http://<your-ip>:3000/api/docs`

Project root is `${HOME}/.chain-control`

Check database password and cipher password

```
cat ${HOME}/.chain-control/.env
```