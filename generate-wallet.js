// generate wallet

const fs = require('fs');
const { Keypair, Connection, LAMPORTS_PER_SOL } = require("@solana/web3.js");

async function generateWallet() {
    const keypair = Keypair.generate();
    console.log(keypair.publicKey.toBase58());

    fs.writeFileSync('dev-wallet.json', JSON.stringify(Array.from(keypair.secretKey)));

    console.log("saved the wallet");

    const connection = new Connection('https://api.devnet.solana.com');
    const signature = await connection.requestAirdrop(keypair.publicKey, 1 * LAMPORTS_PER_SOL);

    await connection.confirmTransaction(signature, "confirmed");

    const bal = await connection.getBalance(keypair.publicKey);

}

generateWallet();
