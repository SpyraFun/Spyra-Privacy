const fs = require('fs');
const {Connection, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL} = require('@solana/web3.js');

require('dotenv').config();

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL;
const WALLET_PATH = process.env.WALLET_PATH;


function loadKeypair(walletPath) {

    const secret = JSON.parse(fs.readFileSync(walletPath, "utf8"));

    return Keypair.fromSecretKey(Uint8Array.from(secret));

}

const connection = new Connection(SOLANA_RPC_URL);
const wallet = loadKeypair(WALLET_PATH);

async function getBalance() {


    const balance = await connection.getBalance(wallet.publicKey);

    return balance / LAMPORTS_PER_SOL;

}

async function sendSol(to, amount) {

    const lamports = Math.round(amount * LAMPORTS_PER_SOL);
    
    const fromBalance = await connection.getBalance(wallet.publicKey);

    if (fromBalance < lamports) {
        throw new Error('Not enough SOL for transaction.');
    }

    const {publicKey} = require('@solana/web3.js');

    const toPubkey = new PublicKey(to);

    const tx = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: toPubkey,
            lamports: lamports,
        })
    );

    const signature = await sendAndConfirmTransaction(connection, tx, [wallet]);

    module.exports = {
        getBalance,
        sendSol,
        walletPublicKey: wallet.publicKey.toBase58(),
        solanaURL: SOLANA_RPC_URL,
    }



}