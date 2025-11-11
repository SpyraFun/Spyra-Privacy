const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const { getBalance, sendSol, walletPublicKey, solanaURL } = require('./solanaClient');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/health', (req, res) => {


    res.json({status:'ok', wallet: walletPublicKey});


});

app.get('/api/balance', async (req, res) => {

    try {
        const balance = await getBalance();
        res.json({wallet: walletPublicKey, balance});
    } catch (error) {
        console.error('Error getting balance:', error.message);
        res.status(500).json({status:'error', message: error.message});
    }

});

app.post("/api/send", async (req, res) => {

    const {to, amount} = req.body;

    if (!to || amount !== Number(amount)) {


        return res.status(400).json({status:'error', message: 'Missing or invalid address or amount of SOL'});

    }

    try {

        console.log("request to send ${amount} SOL to ${to}");

        const signature = await sendSol(to, amount);

        const balance = await getBalance();

        res.json({
            status:'ok',
            signature,
            solscanURL: 'https://solscan.io/tx/${signature}?cluster=devnet',
            newBalance: balance,
        });
    } catch (error) {
        console.error('Error sending SOL in api/send:', error.message);
        res.status(500).json({status:'error', message: error.message});
    }
});

app.listen(port, () => {
    console.log('API LISTENING ON http://localhost:${port}');
    console.log('Wallet:', walletPublicKey);
    console.log('SOLANA:', solanaURL);
});

    


