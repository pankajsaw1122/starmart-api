const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const async = require('async');
var nodemailer = require('nodemailer');
var func = require('./../../commonfunction'); // call common fuctions
var sendResponse = require('./../../sendresponse'); // send response to user
const connection = require('../../../models/educraftersdb');

// Api call
router.post('/studentAdmission', (req, res) => {
    var manValues = [req.body.student_image_id, req.body.admission_date, req.body.student_name, req.body.board, req.body.student_class, req.body.student_session, req.body.email_id, req.body.parents_contact_number];
    async.waterfall([
        function (callback) {
            // check empty values
            func.checkBlank(res, manValues, callback);
        },
        function (callback) {
            //  validate email
            func.checkEmailValidity(res, req.body.email_id, callback);
        },
        function (callback) {
            // check if student allready registered
            func.checkEmailExistence(res, req.body.email_id, callback);
        }
    ],
        function () {
            var query = connection.query('SELECT student_id FROM studentDetails WHERE board = ? AND student_class = ? AND student_session = ?', [req.body.board, req.body.student_class, req.body.student_session], function (error, results, fields) {
                if (error) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data                   
                } else {
                    let count = results.length + 1;
                    let rollSession = req.body.student_session.slice(2, 4);
                    let studentRoll = req.body.board + '/' + req.body.student_class + '/' + rollSession + '/' + count;

                    var post = {
                        admission_date: req.body.admission_date,
                        student_roll_number: studentRoll,
                        student_name: req.body.student_name,
                        board: req.body.board,
                        school_name: req.body.school_name,
                        student_class: req.body.student_class,
                        student_session: req.body.student_session,
                        subjects: req.body.subjects,
                        last_exam_percentage: req.body.last_exam_percentage,
                        email_id: req.body.email_id,
                        student_mobile_number: req.body.student_mobile_number,
                        gender: req.body.gender,
                        parents_name: req.body.parents_name,
                        parents_contact_number: req.body.parents_contact_number,
                        parents_occupation: req.body.parents_occupation,
                        student_image_id: req.body.student_image_id
                    };
                    var query = connection.query('INSERT INTO studentDetails SET ?', post, function (error, results, fields) {
                        if (error) {
                            sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data                                               
                        } else {
                            sendResponse.sendSuccessData('Data submitted successfully', res);
                        }
                    });
                }
            });
        }
    )
});

// Api call
router.post('/updateStudentDetails', (req, res) => {
    let rollCheck = req.body.student_roll_number.split("/");
    let rollSession = req.body.student_session.slice(2, 4);
    if (rollCheck[0] !== req.body.board || rollCheck[1] !== req.body.student_class || rollCheck[2] !== rollSession) {
        var query = connection.query('SELECT student_id FROM studentDetails WHERE board = ? AND student_class = ? AND student_session = ?', [req.body.board, req.body.student_class, req.body.student_session], function (error, results, fields) {
            if (error) {
                sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data                                     
            } else {
                if (results.length === 0) {
                    sendResponse.sendErrorMessage('No data found', res); // send err message if unable to save data                     
                } else {
                    let count = results.length + 1;
                    let rollSessionNew = req.body.student_session.slice(2, 4);
                    let studentRollNew = req.body.board + '/' + req.body.student_class + '/' + rollSessionNew + '/' + count;
                    let updateData = [
                        studentRollNew,
                        req.body.admission_date,
                        req.body.student_name,
                        req.body.board,
                        req.body.school_name,
                        req.body.student_class,
                        req.body.student_session,
                        req.body.subjects,
                        req.body.last_exam_percentage,
                        req.body.email_id,
                        req.body.student_mobile_number,
                        req.body.parents_contact_number,
                        req.body.student_image,
                        req.body.student_roll_number
                    ];
                    var query = connection.query('Update studentDetails set student_roll_number = ? admission_date = ? student_name = ? board = ? school_name = ? student_class = ? student_session = ? subjects = ? last_exam_percentage = ? email_id = ? student_mobile_number = ? parents_contact_number = ? student_image = ? WHERE student_roll_number = ?', updateData, function (error, results, fields) {
                        if (error) {
                            sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data  
                        } else {
                            sendResponse.sendSuccessData('Data updated successfully', res);
                        }
                    });
                }
            }
        });
    } else {
        let updateData = [
            req.body.admission_date,
            req.body.student_name,
            req.body.school_name,
            req.body.subjects,
            req.body.last_exam_percentage,
            req.body.email_id,
            req.body.student_mobile_number,
            req.body.parents_contact_number,
            req.body.student_image,
            req.body.student_roll_number
        ];
        var query = connection.query('Update studentDetails set admission_date = ? student_name = ? school_name = ? subjects = ? last_exam_percentage = ? email_id = ? student_mobile_number = ? parents_contact_number = ? student_image = ? WHERE student_roll_number = ?', updateData, function (error, results, fields) {
            if (error) {
                sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data  
            } else {
                sendResponse.sendSuccessData('Data updated successfully', res);
            }
        });
    }
});


// Api call
router.post('/searchStudent', (req, res) => {
    var manValues = [req.body.searchText];

    async.waterfall([
        function (callback) {
            // check empty values
            func.checkBlank(res, manValues, callback);
        }
    ],
        function () {
            var query = connection.query('SELECT * FROM studentDetails WHERE student_roll_number = ? OR email_id = ? OR student_mobile_number = ?', [req.body.searchText, req.body.searchText, req.body.searchText], function (error, results, fields) {
                if (error) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data                                     
                } else {
                    if (results.length === 0) {
                        sendResponse.sendErrorMessage('No data found', res); // send err message if unable to save data                     
                    } else {
                        var studentDetail = results;
                        var query = connection.query('SELECT imagePath FROM studentImages WHERE Id = ?', [studentDetail[0].student_image_id], function (error, results, fields) {
                            let data = {
                                data: studentDetail,
                                imagePath: results[0].imagePath
                            };
                            sendResponse.sendSuccessData(data, res); // send user data to client
                        });
                    }
                }
            });
        }
    )
});

// Api call
router.post('/deleteStudent', (req, res) => {
    var manValues = [req.body.student_roll_number, req.body.accessToken];

    async.waterfall([
        function (callback) {
            func.checkBlank(res, manValues, callback);
        }
    ],
        function () {
            var query = connection.query('SELECT * FROM adminDetails WHERE accessToken = ?', [req.body.accessToken], function (error, results, fields) {
                if (error) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data                                     
                } else {
                    if (results.length === 0) {
                        sendResponse.sendErrorMessage('Invalid access token', res); // send err message if unable to save data                     
                    } else {
                        var studentDetail = results;
                        var query = connection.query('DELETE FROM studentDetails WHERE student_roll_number = ?,'[req.body.student_roll_number], function (error, results, fields) {
                            if (err) {
                                sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data                                       
                            } else {
                                sendResponse.sendSuccessData('Student data deleted successfully', res); // send user data to client                                
                            }
                        });
                    }
                }
            });
        }
    )
});

module.exports = router;