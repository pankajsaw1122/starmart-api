const express = require('express');
const mysql = require('mysql');
const async = require('async');
const bcrypt = require('bcrypt');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
const router = express.Router();
var func = require('./../../commonfunction'); // call common fuctions
var sendResponse = require('./../../sendresponse'); // send response to user

const connection = require('../../../models/educraftersdb');

// Api call
router.post('/registerAdmin', (req, res) => {
    var manValues = [req.body.name, req.body.email_id, req.body.password, req.body.mobile_number];

    async.waterfall([
        function (callback) {
            // check empty values
            func.checkBlank(res, manValues, callback);
        },
        function (callback) {
            //  validate email
            func.checkEmailValidity(res, req.body.userEmail, callback);
        },
        function (callback) {
            // check if user allready registered
            func.checkEmailExistence(res, req.body.userEmail, callback);
        },
    ],
        function () {
            let hash = bcrypt.hashSync(req.body.password, 10);
            var post = { accessToken: randomstring.generate(12), name: req.body.name, email_id: req.body.email_id, password: hash, mobile_number: req.body.mobile_number };
            var query = connection.query('INSERT INTO adminDetails SET ?', post, function (error, results, fields) {
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
    var manValues = [req.body.email_id, req.body.password];

    async.waterfall([
        function (callback) {
            // check empty values
            func.checkBlank(res, manValues, callback);
        },
        function (callback) {
            // check if user registered or not
            func.checkEmailAvailibility(res, req.body.email_id, callback);
        }
    ],
        function () {
            var query = connection.query('SELECT * FROM adminDetails WHERE email_id = ?', [req.body.email_id], function (error, results, fields) {
                if (error) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err msg if err in finding user                  
                } else {
                    if (results.length == 0) {
                        sendResponse.sendErrorMessage('Incorrect login credential', res);
                    } else {
                        const checkPassword = bcrypt.compareSync(req.body.password, results[0].password);
                        if (checkPassword) {
                            let data = {
                                accessToken: results[0].accessToken,
                                adminName: results[0].name,
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
module.exports = router;

