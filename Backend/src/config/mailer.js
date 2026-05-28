const nodemailer = require('nodemailer');

console.log('Enviando desde:', process.env.GMAIL_USER)

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

module.exports = transporter;