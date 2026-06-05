const nodemailer = require('nodemailer');

console.log('Enviando desde:', process.env.GMAIL_USER)

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    family: 4,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

module.exports = transporter;