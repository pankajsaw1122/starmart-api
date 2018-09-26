const express = require('express');
const router = express.Router();
var multer = require('multer');
var fs = require('fs-extra');
var connection = require('../../../config/database.config');
var validate = require('../../common/validation');
var func = require('../../common/commonfunction'); // call common fuctions
var sendResponse = require('../../common/sendresponse'); // send response to user

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = multer({
    storage: storage
}).single('image');

// Api call
router.post('/productMainImage', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
        } else {
            let data = JSON.parse(req.body.data);
            console.log(data);
            console.log(req.file);
            if (req.file === undefined) {
                sendResponse.sendErrorMessage('Image not selected', res); // send err message if unable to save data                
            } else {
                const mainImagePath = req.file.path;
                const destPath = 'public/uploads/' + data.departmentId.toString() + '/' + data.subDepartmentId.toString() + '/' + req.file.filename
                let finalImagePath = destPath.substring(7, destPath.length);
                console.log(finalImagePath);
                fs.move(mainImagePath, destPath).then(() => {
                    console.log('successfully moved!');
                    console.log('Upload image path is ***************');
                    console.log(finalImagePath);
                    connection.query('update products set main_image_path =? where id = ?', [finalImagePath, data.productId], function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            sendResponse.sendErrorMessage('error in uploading images', res);
                        } else {
                            sendResponse.sendSuccessData(results.insertId, res);
                        }
                    });
                }).catch(err => {
                    console.error(err);
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res);
                });
            }
        }
    });
});

// Api call
router.post('/productAuxillaryImage', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
        } else {
            let data = JSON.parse(req.body.data);
            console.log(data);
            console.log(req.file);
            if (req.file === undefined) {
                sendResponse.sendErrorMessage('Image not selected', res); // send err message if unable to save data                
            } else {
                const mainImagePath = req.file.path;
                const destPath = 'public/uploads/' + data.departmentId.toString() + '/' + data.subDepartmentId.toString() + '/' + req.file.filename
                let finalImagePath = destPath.substring(7, destPath.length);
                console.log(finalImagePath);
                fs.move(mainImagePath, destPath).then(() => {
                    console.log('successfully moved!');
                    console.log('Upload image path is ***************');
                    console.log(finalImagePath);
                    connection.query('update products set auxillary_image_path =? where id = ?', [finalImagePath, data.productId], function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            sendResponse.sendErrorMessage('error in uploading images', res);
                        } else {
                            sendResponse.sendSuccessData(results.insertId, res);
                        }
                    });
                }).catch(err => {
                    console.error(err);
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res);
                });
            }
        }
    });
});

module.exports = router;