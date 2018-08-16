const mongoose = require('mongoose');
var regex = require('regex-email');
const async = require('async');
const connection = require('../models/educraftersdb');
var sendResponse = require('./sendresponse');

// check for blank values
exports.checkBlank = function (res, manValues, callback) {
    var checkBlankData = checkBlank(manValues);
    if (checkBlankData) {
        sendResponse.sendErrorMessage('Some Parameter Missing', res);
    }
    else {
        callback(null);
    }
}

function checkBlank(arr) {

    var arrlength = arr.length;

    for (var i = 0; i < arrlength; i++) {
        if (arr[i] == '') {
            return 1;
            break;
        }
        else if (arr[i] == undefined) {
            return 1;
            break;
        }
        else if (arr[i] == '(null)') {
            return 1;
            break;
        }
    }
    return 0;
}

// check email is valid or not
exports.checkEmailValidity = function (res, email, callback) {
    if (regex.test(email) === false) {
        sendResponse.sendErrorMessage('Invalid email id', res);
    } else {
        callback(null);
    }
}

// check if email is registered or not
exports.checkEmailExistence = function (res, email, callback) {
    var query = connection.query('SELECT * FROM adminDetails WHERE email_id = ?', [email], function (error, results, fields) {
        if (error) {
            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
        } else {
            if (results.length === 0) {
                callback(null);
            } else {
                sendResponse.sendErrorMessage('Email-id is already registered', res);
            }
        }
    });
}
// check email is registered or not
exports.checkEmailAvailibility = function (res, email, callback) {
    var query = connection.query('SELECT * FROM adminDetails WHERE email_id = ?', [email], function (error, results, fields) {
        if (error) {
            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
        } else {
            if (results.length === 0) {
                sendResponse.sendErrorMessage('Email-id is not registered', res);
            } else {
                callback(null);
            }
        }
    });
}

// pass image path to user register api
// exports.getProfileImagePath = function (imageId, callback) {
//     return profileImageCollection.findById(imageId, function (err, profile_image) {
//         if (err) {
//             console.log(err);
//             sendResponse.sendErrorMessage('Something went wrong please try again later', res);
//         } else {
//             callback(profile_image.upload_path);
//         }
//     })
// }


