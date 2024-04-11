#!/bin/bash

DIR=${HOME}/.chain-control
mkdir -p $DIR
cd "$DIR" || exit
rm -rf docker-compose.yml
rm -rf .env.dist
rm -rf .env

function install
{
  wget "https://raw.githubusercontent.com/singlesly/multichain-wallets/main/production/docker/docker-compose.yml" # docker-compose
  wget "https://raw.githubusercontent.com/singlesly/multichain-wallets/main/production/docker/.env.dist" # dist
  cp .env.dist .env

  # fill password envs
  echo "DB_PASS=$(openssl rand -hex 12)" >> .env
  echo "CIPHER_PASSWORD=$(openssl rand -hex 12)" >> .env

  docker-compose up -d
}

install