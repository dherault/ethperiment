# Ethperiment
An Ethereum experimentation. :curly_loop:

WIP

### Installation

`npm i -g nodemon babel-cli && npm i` and install [geth](https://github.com/ethereum/go-ethereum/wiki)

### Usage

`npm run rpc` to launch the custom RPC server/node (listens on 0.0.0.0, I work on a VM)

`npm start` to launch both dev and api servers

`npm run reset` to reset every block/tnx/accounts in the blockchain

### Blockchain

This project uses a custom local blockchain, with 20 Ethers allocated to this EOA:
- Address: bcddf4e10154518dfa25488efd295a3d192e0601
- Passphrase: password

### Notes

This project displays no React best pratices and is focused on the blockchain.

### License

GPL-3.0
