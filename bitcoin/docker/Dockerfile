FROM ubuntu:20.04

WORKDIR /root

RUN export DEBIAN_FRONTEND=noninteractive && \
    apt update -y && \
    apt install wget -y && \
    wget https://bitcoincore.org/bin/bitcoin-core-22.0/bitcoin-22.0-x86_64-linux-gnu.tar.gz && \
    tar -xf bitcoin-22.0-x86_64-linux-gnu.tar.gz && \
    export PATH="/root/bitcoin-22.0/bin:$PATH"

RUN mkdir /root/.bitcoin

COPY ./bitcoin.conf /root/.bitcoin/

EXPOSE 18332

CMD /root/bitcoin-22.0/bin/bitcoind
