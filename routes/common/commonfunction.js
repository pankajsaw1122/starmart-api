const async = require('async');
const connection = require('../../config/database.config');
var sendResponse = require('./sendresponse');


exports.checkAuth = function(res, accessToken, callback) {
    if(!accessToken) {
        sendResponse.sendErrorMessage('access token is missing', res);
    } 
    connection.query('SELECT id FROM admin WHERE access_token = ?' , [accessToken], function (error, results, fields) {
        if (error) {
            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
        } else {
            if (results.length === 0) {
                sendResponse.sendErrorMessage('Unautharized request', res);
            } else {
                callback(null);
            }
        }
    });
}

// check email is valid or not
exports.checkAlreadyRegistered = function (res, mobile, email, callback) {
    connection.query('SELECT id FROM admin WHERE mobile_number = ? OR email_id = ?' , [mobile, email], function (error, results, fields) {
        if (error) {
            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
        } else {
            if (results.length === 0) {
                callback(null);
            } else {
                sendResponse.sendErrorMessage('User is already registered', res);
            }
        }
    });
}

// check if email is registered or not
exports.checUserExistence = function (res, emailOrPhone, callback) {
     connection.query('SELECT id FROM admin WHERE email_id = ? OR mobile_number = ?', [emailOrPhone, emailOrPhone], function (error, results, fields) {
        if (error) {
            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
        } else {
            if (results.length === 0) {
                sendResponse.sendErrorMessage('User is not registered', res);
            } else {
                callback(null);                
            }
        }
    });
}

exports.checkExistingProduct = function(res, productName, callback) {
    connection.query('SELECT id FROM products WHERE product_name = ?', [productName], function (error, results, fields) {
        if (error) {
            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
        } else {
            if (results.length === 0) {
                sendResponse.sendErrorMessage('This Product name already added', res);
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


