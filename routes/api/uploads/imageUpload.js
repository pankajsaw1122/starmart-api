const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
var multer = require('multer');
const path = require('path');
var fs = require('fs');
var http = require('http');
const sharp = require('sharp');
var randomstring = require("randomstring");
var func = require('./../../commonfunction');
var sendResponse = require('./../../sendresponse'); // send response to user
const connection = require('../../../models/educraftersdb');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage
}).single('image');

// Api call
router.post('/imageUpload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
        } else {
            console.log(req.file);
            if (req.file === undefined) {
                sendResponse.sendErrorMessage('Image not selected', res); // send err message if unable to save data                
            } else {
                const randomImageName = req.file.destination + randomstring.generate(7) + req.file.filename;
                sharp(req.file.destination + req.file.filename).resize(600, 480).max().toFile(randomImageName, function (err) {
                    if (err) {
                        sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data                             
                    } else {
                        fs.unlink(req.file.destination + req.file.filename, function (err) {
                            console.log('file deleted');
                            if (err) {
                                sendResponse.sendErrorMessage('error in uploading images', res);
                            } else {
                                var post = {
                                    imagePath: randomImageName.substring(8, randomImageName.length)
                                };
                                var query = connection.query('INSERT INTO studentImages SET ?', post, function (error, results, fields) {
                                    if (error) {
                                        sendResponse.sendErrorMessage('error in uploading images', res);
                                    } else {
                                        sendResponse.sendSuccessData(results.insertId, res);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});

module.exports = router;