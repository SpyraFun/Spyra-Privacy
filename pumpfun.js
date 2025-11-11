const fs = require('fs');
const {Connection, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL} = require('@solana/web3.js');

const PUMPFUN_API_URL = 'wss://small-twilight-sponge.solana-mainnet.quiknode.pro/71bdb31dd3e965467b1393cebaaaebe69d481dbeb/';

function loadKeypair(walletPath) {
    const secret = JSON.parse(fs.readFileSync(walletPath, "utf8"));

    return Keypair.fromSecretKey(Uint8Array.from(secret));

}

async function main() {

    const connection = new Connection('https://api.devnet.solana.com');
    const wallet = loadKeypair('dev-wallet.json');
    
    console.log('Wallet:', wallet.publicKey.toBase58());



}