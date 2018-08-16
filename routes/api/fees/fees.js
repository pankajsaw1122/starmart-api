const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const async = require('async');
var moment = require('moment');
require('moment-recur');
var func = require('./../../commonfunction'); // call common fuctions
var sendResponse = require('./../../sendresponse'); // send response to user

const connection = require('../../../models/educraftersdb');

// Api call
router.post('/insertFees', (req, res) => {
    console.log('fees request');
    var manValues = [req.body.studentRollNumber, req.body.feesSubmissionDate, req.body.feesAmount, req.body.feesforMonth];

    async.waterfall([
        function (callback) {
            // check empty values
            func.checkBlank(res, manValues, callback);
        }
    ],
        function () {
            var currentDate = new Date(req.body.feesSubmissionDate.toString());
            console.log(currentDate);
            currentDate.setDate(currentDate.getDate() + 30);
            var nextDueDate = currentDate.toISOString();
            console.log(nextDueDate);
            var post = {
                student_roll_number: req.body.studentRollNumber,
                fees_submit_date: req.body.feesSubmissionDate,
                fees_for_month: req.body.feesforMonth,
                fees_amount: req.body.feesAmount,
                next_due_date: nextDueDate,
                remarks: req.body.feesRemarks
            };
            var query = connection.query('INSERT INTO studentFeesDetails SET ?', post, function (error, results, fields) {
                if (error) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data                     
                } else {
                    // var fromEmail = 'educrafters.org@outlook.in';
                    // var toEmail = 'pankajsaw1122@gmail.com';

                    // const transporter = require('../models/emailCredential');
                    // transporter.sendMail({
                    //     from: fromEmail,
                    //     to: toEmail,
                    //     subject: 'Fees Submission Confirmation',
                    //     text: 'Fees Submission confirmed',
                    //     html: '<p> This is online Fees Receipt.</p> <br /> <h3> Fees Details : </h3>  <b> Fees Submission Date: </b>' + req.body.fees_submit_date + '<br /> <b> Fees for Month : </b>' + req.body.fees_for_month + '<br /> <b> Fees Amount: </b> ' + req.body.fees_amount + '</p>'
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
                    sendResponse.sendSuccessData('Fees inserted successfully', res); // send user data to client
                }
            });
        }
    )
});
module.exports = router;
