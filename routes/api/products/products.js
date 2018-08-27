const express = require('express');
const async = require('async');
var bcrypt = require('bcrypt');
var randomstring = require("randomstring");
var moment = require('moment');
var sendMail = require('../../services/sendMail/emailService');
const connection = require('../../../config/database.config');
const router = express.Router();
var validate = require('../../common/validation')
var func = require('../../common/commonfunction'); // call common fuctions
var sendResponse = require('../../common/sendresponse'); // send response to user

// Api call
router.post('/addProduct', (req, res) => {
    console.log('Inside admin file');
    let manValues = [
        req.body.departmentId,
        req.body.subDepartmentId,
        req.body.subCategoryId,
        // req.body.productId,
        req.body.productName,
        req.body.brandId,
        req.body.description,
        req.body.regularPrice,
        req.body.salePrice,
        req.body.taxStatusId,
        req.body.taxClassId,
        req.body.sku,
        req.body.manageStock,
        req.body.stockStatusId,
        req.body.soldIndv,
        req.body.weight,
        req.body.dimension,
        req.body.shippingClassId,
        req.body.upsells,
        req.body.crossSells,
        req.body.longDescription,
        req.body.additionalInfo,
        req.body.help,
        req.body.tags,
        // req.body.mainImage,
        // req.body.auxillaryImage
    ];

    async.waterfall([
        function (callback) {
            // check for unauthorized request
            func.checkAuth(res, req.body.accessToken, callback);
        },
        function (callback) {
            // check empty or invalid values
            validate.validateProduct(res, manValues, callback);
        },
        function (callback) {
            // check if user allready registered
            func.checkExistingProduct(res, req.body.productName, callback);
        },
    ],
        function () {
            let post = {
                department_id: req.body.departmentId,
                subDepartment_id: req.body.subDepartmentId,
                subCategory_Id: req.body.subCategoryId,
                // product_id: req.body.productId,
                product_name: req.body.productName,
                brand_id: req.body.brandId,
                description: req.body.description,
                regular_price: req.body.regularPrice,
                sale_price: req.body.salePrice,
                taxstatus_id: req.body.taxStatusId,
                taxclass_id: req.body.taxClassId,
                sku: req.body.sku,
                manage_stock: req.body.manageStock,
                stockstatus_id: req.body.stockStatusId,
                sold_indvidual: req.body.soldIndv,
                weight: req.body.weight,
                dimension: req.body.dimension,
                shippingclass_id: req.body.shippingClassId,
                upsells: req.body.upsells,
                cross_sells: req.body.crossSells,
                long_description: req.body.longDescription,
                additional_info: req.body.additionalInfo,
                help: req.body.help,
                tags: req.body.tags,
                created_at: moment.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            connection.query('INSERT INTO products SET ?', post, function (error, results, fields) {
                if (error) {
                    console.log(error);
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
                } else {
                    console.log(results);
                    sendResponse.sendSuccessData('Product saved successfully', res); // send successfull data submission response
                }
            });
        }
    )
});

router.get('/', (req, res) => {
    let query = '';
    let param = [];
    if (req.query.departmentId && !req.query.subDepartmenId) {
        query = 'select * from products where department_id = ?';
        param.push(req.query.departmentId);
    } else if (!req.query.departmentId && req.query.subDepartmenId) {
        query = 'select * from products where sub_department_id = ?';
        param.push(req.query.subDepartmenId);
    } else if (req.query.departmentId && req.query.subDepartmenId) {
        query = 'select * from products where department_id = ?, sub_department_id = ?';
        param = [req.query.departmentId, req.query.subDepartmenId];
    } else {
        query = 'select * from products';
    }
    connection.query(query, param, function (error, results, fields) {
        if (error) {
            console.log(error);
            sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
        } else {
            console.log(results);
            sendResponse.sendSuccessData('Product saved successfully', res); // send successfull data submission response
        }
    });
})

// Api call
router.post('/updateProduct', (req, res) => {
    console.log('Inside admin file');
    let manValues = [
        req.body.departmentId,
        req.body.subDepartmentId,
        req.body.subCategoryId,
        // req.body.productId,
        req.body.productName,
        req.body.brandId,
        req.body.description,
        req.body.regularPrice,
        req.body.salePrice,
        req.body.taxStatusId,
        req.body.taxClassId,
        req.body.sku,
        req.body.manageStock,
        req.body.stockStatusId,
        req.body.soldIndv,
        req.body.weight,
        req.body.dimension,
        req.body.shippingClassId,
        req.body.upsells,
        req.body.crossSells,
        req.body.longDescription,
        req.body.additionalInfo,
        req.body.help,
        req.body.tags,
        // req.body.mainImage,
        // req.body.auxillaryImage
    ];

    async.waterfall([
        function (callback) {
            // check for unauthorized request
            func.checkAuth(res, req.body.accessToken, callback);
        },
        function (callback) {
            // check empty or invalid values
            validate.validateProduct(res, manValues, callback);
        },
    ],
        function () {
            manValues.push(moment.utc().format("YYYY-MM-DD HH:mm:ss"));

            connection.query('udate products SET subDepartment_id = ?, subCategory_Id = ?,  product_name = ?,' +
                'brand_id = ?, description = ? description = ?, regular_price = ? ,sale_price = ?,' +
                'taxstatus_id = ?, taxclass_id = ?, sku = ?, manage_stock = ?, stockstatus_id = ?,' +
                ' sold_indvidual = ?, weight = ?, dimension = ?, shippingclass_id = ?,' +
                'upsells = ?, cross_sells = ?, long_description = ?, additional_info = ?, help = ?, tags = ?, updated_at = ?', manvalues, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
                    } else {
                        console.log(results);
                        sendResponse.sendSuccessData('Product updated successfully', res); // send successfull data submission response
                    }
                });
        }
    )
});

router.post('/deletProduct', (req, res) => {
    console.log('Inside product file');

    async.waterfall([
        function (callback) {
            // check for unauthorized request
            func.checkAuth(res, req.body.accessToken, callback);
        },
        function (callback) {
            // check empty or invalid values
            validate.deleteId(res, req.body.productId, callback);
        },
    ],
        function () {
            connection.query('delete from products where id = ?', [req.body.accessToken], function (error, results, fields) {
                if (error) {
                    console.log(error);
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
                } else {
                    console.log(results);
                    sendResponse.sendSuccessData('Product deleted successfully', res); // send successfull data submission response
                }
            });
        }
    )
});

module.exports = router;

