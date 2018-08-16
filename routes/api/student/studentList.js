const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
var http = require('http');
var func = require('./../../commonfunction'); 
var sendResponse = require('./../../sendresponse'); // send response to user
const connection = require('../../../models/educraftersdb');

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(express.static('./public'));

// Api call
router.get('/studentList', (req, res) => {
    console.log('get request');
    if (!req.query.board && !req.query.student_class && !req.query.student_session) {
        sendResponse.sendErrorMessage('Some parameter missing', res); // send err message if unable to save data  
    } else {
        if (!req.query.board && !req.query.student_class && req.query.student_session) {
            var query = connection.query('SELECT * FROM studentDetails WHERE student_session = ?', [req.query.student_session], function (error, results, fields) {
                if (error) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data                                                       
                } else {
                    if (results.length == 0) {
                        sendResponse.sendErrorMessage('No data found', res); // send err message if unable to save data                                     
                    } else {
                        sendResponse.sendSuccessData(results, res);
                    }
                }
            });
        } else if (!req.query.board && req.query.student_class && !req.query.student_session) {
            var query = connection.query('SELECT * FROM studentDetails WHERE student_class = ?', [req.query.student_class], function (error, results, fields) {
                if (error) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
                } else {
                    if (results.length == 0) {
                        sendResponse.sendErrorMessage('No data found', res); // send err message if unable to save data 
                    } else {
                        sendResponse.sendSuccessData(results, res);
                    }
                }
            });
        } else if (!req.query.board && req.query.student_class && req.query.student_session) {
            var query = connection.query('SELECT * FROM studentDetails WHERE student_class = ? AND student_session = ?', [req.query.student_class, req.query.student_session], function (error, results, fields) {
                if (error) {
                    throw error;
                } else {
                    if (results.length == 0) {
                        sendResponse.sendErrorMessage('No data found', res);
                    } else {
                        sendResponse.sendSuccessData(results, res);
                    }
                }
            });
        } else if (req.query.board && !req.query.student_class && !req.query.student_session) {
            var query = connection.query('SELECT * FROM studentDetails WHERE board = ?', [req.query.board], function (error, results, fields) {
                if (error) {
                    throw error;
                } else {
                    if (results.length == 0) {
                        sendResponse.sendErrorMessage('No data found', res);
                    } else {
                        sendResponse.sendSuccessData(results, res);
                    }
                }
            });
        } else if (req.query.board && !req.query.student_class && req.query.student_session) {
            var query = connection.query('SELECT * FROM studentDetails WHERE board = ? AND student_session = ?', [req.query.board, req.query.student_session], function (error, results, fields) {
                if (error) {
                    throw error;
                } else {
                    if (results.length == 0) {
                        sendResponse.sendErrorMessage('No data found', res);
                    } else {
                        sendResponse.sendSuccessData(results, res);
                    }
                }
            });
        } else if (req.query.board && req.query.student_class && !req.query.student_session) {
            var query = connection.query('SELECT * FROM studentDetails WHERE board = ? AND student_class = ?', [req.query.board, req.query.student_class], function (error, results, fields) {
                if (error) {
                    throw error;
                } else {
                    if (results.length == 0) {
                        sendResponse.sendErrorMessage('No data found', res);
                    } else {
                        sendResponse.sendSuccessData(results, res);
                    }
                }
            });
        } else if (req.query.board && req.query.student_class && req.query.student_session) {
            var query = connection.query('SELECT * FROM studentDetails WHERE board = ? AND student_class = ? AND student_session = ?', [req.query.board, req.query.student_class, req.query.student_session], function (error, results, fields) {
                if (error) {
                    throw error;
                } else {
                    if (results.length == 0) {
                        sendResponse.sendErrorMessage('No data found', res);
                    } else {
                        sendResponse.sendSuccessData(results, res);
                    }
                }
            });
        }
    }
});

module.exports = router;
