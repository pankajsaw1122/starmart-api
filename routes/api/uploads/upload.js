const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
var multer = require('multer');
const path = require('path');
var fs = require('fs-extra');
var randomstring = require("randomstring");
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
    let departmentId = req.body.departmentId.toString();
    let categoryId = req.body.categoryId.toString();
    let productId = req.body.productId;
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
        } else {
            console.log(req.file);
            if (req.file === undefined) {
                sendResponse.sendErrorMessage('Image not selected', res); // send err message if unable to save data                
            } else {
                const mainImagePath = req.file.path;
                const destPath = 'public/uploads/' + departmentId + '/' + categoryId + '/' + req.file.filename
                let finalImagePath = destPath.substring(0, 6);
                console.log(finalImagePath);
                fs.move(mainImagePath, destPath).then(() => {
                    fs.unlink(mainImagePath, (err) => {
                        if (err) {
                            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
                        } else {
                            console.log('successfully moved!');
                            console.log('Upload image path is ***************');
                            console.log(post.imagePath);
                            connection.query('update products set main_image =? where id = ?', [finalImagePath, productId], function (error, results, fields) {
                                if (error) {
                                    sendResponse.sendErrorMessage('error in uploading images', res);
                                } else {
                                    sendResponse.sendSuccessData(results.insertId, res);
                                }
                            });
                        }
                    });
                }).catch(err => {
                    console.error(err);
                });
            }
        }
    });
});

router.post('/productAuxillaryImage', (req, res) => {
    let departmentId = req.body.departmentId.toString();
    let categoryId = req.body.categoryId.toString();
    let productId = req.body.productId;
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
        } else {
            console.log(req.file);
            if (req.file === undefined) {
                sendResponse.sendErrorMessage('Image not selected', res); // send err message if unable to save data                
            } else {
                const mainImagePath = req.file.path;
                const destPath = 'public/uploads/' + departmentId + '/' + categoryId + '/' + req.file.filename
                let finalImagePath = destPath.substring(0, 6);
                console.log(finalImagePath);
                fs.move(mainImagePath, destPath).then(() => {
                    fs.unlink(mainImagePath, (err) => {
                        if (err) {
                            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
                        } else {
                            console.log(post.imagePath);
                            connection.query('update products set auxillary_image =? where id = ?', [finalImagePath, productId], function (error, results, fields) {
                                if (error) {
                                    sendResponse.sendErrorMessage('error in uploading images', res);
                                } else {
                                    sendResponse.sendSuccessData(results.insertId, res);
                                }
                            });
                        }
                    });
                }).catch(err => {
                    console.error(err);
                });
            }
        }
    });
});

module.exports = router;