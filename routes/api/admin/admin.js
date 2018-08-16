const express = require('express');
const mysql = require('mysql');
const async = require('async');
const bcrypt = require('bcrypt');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
const router = express.Router();
var validate = require('../../validation')
var func = require('./../../commonfunction'); // call common fuctions
var sendResponse = require('./../../sendresponse'); // send response to user

// const connection = require('../../../models/educraftersdb');

// Api call
router.post('/adminRegister', (req, res) => {
    console.log('Inside admin file');
    var manValues = [req.body.firstName, req.body.lastName, req.body.contactNumber, req.body.emailId, req.body.password];

    async.waterfall([
        function (callback) {
            // check empty or invalid values
            validate.validateAdminRegister(res, manValues, callback);
        },
        function (callback) {
            //  validate email
            func.checkEmailValidity(res, req.body.emailId, callback);
        },
        function (callback) {
            // check if user allready registered
            func.checkEmailExistence(res, req.body.userEmail, callback);
        },
    ],
        function () {
            let hash = bcrypt.hashSync(req.body.password, 10);
            var post = { access_token: randomstring.generate(12), first_name: req.body.firstName, last_name: req.body.lastName, email_id: req.body.emaiId, password: hash, contact_number: req.body.contactNumber };
            connection.query('INSERT INTO admin SET ?', post, function (error, results, fields) {
                if (error) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
                } else {
                    // var fromEmail = 'educrafters.org@outlook.in';
                    // var toEmail = req.body.email_id;

                    // const transporter = require('../../../models/emailCredential');
                    // transporter.sendMail({
                    //     from: fromEmail,
                    //     to: toEmail,
                    //     subject: 'Registrantion Confirmation',
                    //     text: 'Congratulation! Registration successfull',
                    //     html: '<p> Congratulation User you successfully registered with Educrafters your login id is your email id and your password is 12345678. </p> <br /> <p> After Login please immediately change your password. </p>'
                    // }, function (error, response) {
                    //     if (error) {
                    //         console.log('Failed in sending mail');
                    //         // console.dir({ success: false, existing: false, sendError: true });
                    //         console.dir(error);
                    //         // res.end('Failed in sending mail');
                    //     } else {
                    //         console.log('Successful in sending email');
                    //         //  console.dir({ success: true, existing: false, sendError: false });
                    //         // console.dir(response);
                    //         // res.end('Successful in sedning email');
                    //     }
                    // });
                }
            });
            console.log(results);
            sendResponse.sendSuccessData(results, res); // send successfull data submission response
        }
    )
});

// Api call
router.post('/adminLogin', (req, res) => {
    var manValues = [req.body.emailOrMobile, req.body.password];

    async.waterfall([
        function (callback) {
            // check empty values
            validate.validateLoginParameter(res, manValues, callback);
        },
        function (callback) {
            // check if user registered or not
            func.checkEmailAvailibility(res, req.body.emailOrMobile, callback);
        }
    ],
        function () {
            connection.query('SELECT * FROM adminDetails WHERE email_id OR contact_number = ?', [req.body.emailOrMobile], function (error, results, fields) {
                if (error) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err msg if err in finding user                  
                } else {
                    if (results.length == 0) {
                        sendResponse.sendErrorMessage('Incorrect login credential', res);
                    } else {
                        const checkPassword = bcrypt.compareSync(req.body.password, results[0].password);
                        if (checkPassword) {
                            let data = {
                                accessToken: results[0].access_token,
                                adminName: results[0].first_name,
                                adminEmail: results[0].email_id
                            };
                            sendResponse.sendSuccessData(data, res); // send user data to client
                        } else {
                            sendResponse.sendErrorMessage('Incorrect login credential', res);  // send err msg 
                        }
                    }
                }
            });
        }
    )
});

router.post('/adminChangePassword', (req, res) => {
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
                                    sendResponse.sendSuccessData('Password Successfully changed', res);
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


router.post('/adminForgetPassword', (req, res) => {
    var manValues = req.body.emailOrMobile;
    async.waterfall([
        function (callback) {
            // check empty values
            validate.validateForgetPassword(res, manValues, callback);
        },
    ],
        function () {
            console.log('In forget password');
            // connection.query('select email_id, contact_number from admin where email_id = ? OR contact_number = ?', [req.body.emailOrMobile], function (error, results, fields) {
            //     if (error) {
            //         sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err msg if err in finding user                  
            //     } else {
            //         if (results.length == 0) {
            //             sendResponse.sendErrorMessage('incorrect id', res);
            //         } else {
            //             const checkPassword = bcrypt.compareSync(req.body.currentPassword, results[0].password);
            //             if (checkPassword) {
            //                 connection.query('update admin set password = ? WHERE password = ? AND id = ?', [req.body.newPassword, req.body.currentPassword, req.body.adminId], function (error, results, fields) {
            //                     if (error) {
            //                         sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err msg if err in finding user                  
            //                     } else {
            //                         sendResponse.sendSuccessData('Password Successfully changed', res);
            //                     }
            //                 });
            //             } else {
            //                 sendResponse.sendErrorMessage('Current password is incorrect', res); // send err msg if err in finding user                  
            //             }
            //         }
            //     }
            // })
        }
    )
});

module.exports = router;

