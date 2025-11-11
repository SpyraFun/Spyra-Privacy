const fs = require('fs');
const {Connection, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL} = require('@solana/web3.js');


function loadKeypair(walletPath) {
    const secret = JSON.parse(fs.readFileSync(walletPath, "utf8"));

    return Keypair.fromSecretKey(Uint8Array.from(secret));
}

async function main() {
    const from = loadKeypair('dev-wallet.json');
    console.log(from.publicKey.toBase58());
    const to = Keypair.generate();
    const solAmount = 0.01;

    const connection = new Connection('https://api.devnet.solana.com');

    const balance = await connection.getBalance(from.publicKey);
    console.log("starting balance:", balance / LAMPORTS_PER_SOL, "SOL");

    const tx = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: solAmount * LAMPORTS_PER_SOL
        })
    );

    console.log('Sending ${solAmount} SOL to ${to.publicKey.toBase58()}...');

    const signature = await sendAndConfirmTransaction(connection, tx, [from]);
    const newBal = await connection.getBalance(from.publicKey);
    console.log('final balance:', newBal / LAMPORTS_PER_SOL, "SOL");

}

main().catch(console.error);