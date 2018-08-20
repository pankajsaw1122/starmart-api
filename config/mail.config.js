var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
    host: 'smtp.outlook.com',
    port: 587,
    secure: false, // use SSL
    debug: true,
    auth: {
        user: 'educrafters.org@outlook.in',
        pass: 'p1a2-n3k4'
    }
});

module.exports = transport;