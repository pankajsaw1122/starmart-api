const nodemailer = require('nodemailer');
const transporter = require('../../../config/mail.config');
const fromEmail = 'educrafters.org@outlook.in';
exports.registrationConfirmation = function (toEmailId) {
    transporter.sendMail({
        from: fromEmail,
        to: toEmailId,
        subject: 'Registrantion Confirmation',
        text: 'Congratulation! Registration successfull',
        html: '<p> Congratulation User you successfully registered with Educrafters your login id is your email id and your password is 12345678. </p> <br /> <p> After Login please immediately change your password. </p>'
    }, function (error, response) {
        if (error) {
            console.log('Failed in sending mail');
            // console.dir({ success: false, existing: false, sendError: true });
            console.dir(error);
            // res.end('Failed in sending mail');
        } else {
            console.log('Successful in sending email');
            //  console.dir({ success: true, existing: false, sendError: false });
            // console.dir(response);
            // res.end('Successful in sedning email');
        }
    });
}

exports.forgetPasswordMail = function (toEmailId, otpCode) {
    transporter.sendMail({
        from: fromEmail,
        to: toEmailId,
        subject: 'OTP to reset password',
        text: 'Enter this OTP to reset password',
        html: '<p> Please use this OTP <b>' + otpCode + '</b> to reset password. </p>'
    }, function (error, response) {
        if (error) {
            console.log('Failed in sending mail');
            // console.dir({ success: false, existing: false, sendError: true });
            console.dir(error);
            // res.end('Failed in sending mail');
        } else {
            console.log('Successful in sending email');
            //  console.dir({ success: true, existing: false, sendError: false });
            // console.dir(response);
            // res.end('Successful in sedning email');
        }
    });
}