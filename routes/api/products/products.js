const express = require('express');
const async = require('async');
var bcrypt = require('bcrypt');
var randomstring = require("randomstring");
var moment = require('moment');
var sendMail = require('../../services/sendMail/emailService');
const connection = require('../../../config/database.config');
const router = express.Router();
var validate = require('../../common/validation')
var func = require('../../common/commonfunction'); // call common fuctions
var sendResponse = require('../../common/sendresponse'); // send response to user

// Api call
router.post('/addProduct', (req, res) => {
    console.log('Inside admin file');
    var manValues = [req.body.firstName, req.body.lastName, req.body.mobileNumber, req.body.emailId, req.body.password];

    async.waterfall([
        function (callback) {
            // check empty or invalid values
            validate.validateAdminRegister(res, manValues, callback);
        },
        function (callback) {
            // check if user allready registered
            func.checkAlreadyRegistered(res, req.body.mobileNumber, req.body.emailId, callback);
        },
    ],
        function () {
            bcrypt.hash(req.body.password, 10).then(function (hash) {
                var post = { access_token: randomstring.generate(12), first_name: req.body.firstName, last_name: req.body.lastName, email_id: req.body.emailId, password: hash, mobile_number: req.body.mobileNumber, created_at: moment.utc().format("YYYY-MM-DD HH:mm:ss") };
                connection.query('INSERT INTO admin SET ?', post, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
                    } else {
                        // var toEmail = req.body.email_id;
                        sendMail.registrationConfirmation(req.body.emailId);
                        console.log(results);
                        sendResponse.sendSuccessData('Data saved successfully', res); // send successfull data submission response
                    }
                });
            });
        }
    )
});

// Api call
router.post('/login', (req, res) => {
    var manValues = [req.body.emailOrMobile, req.body.password];

    async.waterfall([
        function (callback) {
            // check empty values
            validate.validateLoginParameter(res, manValues, callback);
        },
        function (callback) {
            // check if user registered or not
            func.checUserExistence(res, req.body.emailOrMobile, callback);
        }
    ],
        function () {
            connection.query('SELECT first_name, email_id, mobile_number, access_token, password FROM admin WHERE email_id = ? OR mobile_number = ?', [req.body.emailOrMobile, req.body.emailOrMobile], function (error, results, fields) {
                if (error) {
                    console.log(error);
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err msg if err in finding user                  
                } else {
                    if (results.length == 0) {
                        sendResponse.sendErrorMessage('Incorrect login credential', res);
                    } else {
                        bcrypt.compareSync(req.body.password, results[0].password).then(function (checkPassword) {
                            if (checkPassword) {
                                let data = {
                                    accessToken: results[0].access_token,
                                    adminName: results[0].first_name,
                                    adminEmail: results[0].email_id,
                                    adminMobileNumber: results[0].mobile_number
                                };
                                sendResponse.sendSuccessData(data, res); // send user data to client
                            } else {
                                sendResponse.sendErrorMessage('Incorrect login credential', res);  // send err msg 
                            }
                        });

                    }
                }
            });
        }
    )
});

router.post('/changePassword', (req, res) => {
    var manValues = [req.body.adminId, req.body.currentPassword, req.body.newPassword];
    async.waterfall([
        function (callback) {
            // check empty values
            validate.validateChangePassword(res, manValues, callback);
        },
    ],
        function () {
            connection.query('select password from admin where id = ?', [req.body.adminId], function (error, results, fields) {
                if (error) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err msg if err in finding user                  
                } else {
                    if (results.length == 0) {
                        sendResponse.sendErrorMessage('incorrect id', res);
                    } else {
                        const checkPassword = bcrypt.compareSync(req.body.currentPassword, results[0].password);
                        if (checkPassword) {
                            connection.query('update admin set password = ? WHERE password = ? AND id = ?', [req.body.newPassword, req.body.currentPassword, req.body.adminId], function (error, results, fields) {
                                if (error) {
                                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err msg if err in finding user                  
                                } else {
                                    sendResponse.sendSuccessData('Password changed Successfully', res);
                                }
                            });
                        } else {
                            sendResponse.sendErrorMessage('Current password is incorrect', res); // send err msg if err in finding user                  
                        }
                    }
                }
            })
        }
    )
});


router.post('/forgetPassword', (req, res) => {
    let manValues = req.body.emailOrMobile;
    async.waterfall([
        function (callback) {
            // check empty values
            validate.validateForgetPassword(res, manValues, callback);
        },
    ],
        function () {
            console.log('In forget password');
            connection.query('select id, email_id, mobile_number from admin where email_id = ? OR mobile_number = ?', [req.body.emailOrMobile, req.body.emailOrMobile], function (error, results, fields) {
                if (error) {
                    console.log(error);
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err msg if err in finding user                  
                } else {
                    if (results.length == 0) {
                        sendResponse.sendErrorMessage('incorrect email id or mobile number', res);
                    } else {
                        let emailId = results[0].email_id;
                        let post = { user_id: results[0].id, otp_code: Math.floor(Math.random() * 90000), created_at: moment.utc().format("YYYY-MM-DD HH:mm:ss") }
                        connection.query('insert into otp SET ?', post, function (error, results, fields) {
                            if (error) {
                                console.log(error);
                                sendResponse.sendErrorMessage('Unable to send otp please try again later', res); // send err msg if err in finding user                  
                            } else {
                                sendResponse.sendSuccessData('OTP sent to your email id', res);
                                sendMail.forgetPasswordMail(emailId, results[0].otp_code);
                            }
                        })
                    }
                }
            })
        }
    )
});


router.post('/verifyOtp', (req, res) => {
    let manValues = [req.body.userId, req.body.otp];
    async.waterfall([
        function (callback) {
            // check empty values
            validate.validateOtp(res, manValues, callback);
        },
    ],
        function () {
            console.log('In forget password');
            connection.query('select id from otp where user_id = ? AND otp_code = ?', [req.body.userId, req.body.otp], function (error, results, fields) {
                if (error) {
                    console.log(error);
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err msg if err in finding user                  
                } else {
                    if (results.length == 0) {
                        sendResponse.sendErrorMessage('Otp not mached please try again later', res);
                    } else {
                        sendResponse.sendSuccessData('OTP matched', res);
                    }
                }
            })
        }
    )
});


module.exports = router;

