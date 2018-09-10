const express = require('express');
const async = require('async');
var moment = require('moment');
const connection = require('../../../config/database.config');
const router = express.Router();
var validate = require('../../common/validation');
var func = require('../../common/commonfunction'); // call common fuctions
var sendResponse = require('../../common/sendresponse'); // send response to user

// Api call
router.get('/getDepartment', (req, res) => {
    console.log('Inside categories file');
    connection.query('select id, name from departments order by id', function (error, results, fields) {
        if (error) {
            console.log(error);
            sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
        } else {
            console.log(results);
            sendResponse.sendSuccessData(results, res); // send successfull data submission response
        }
    });
});

router.get('/getSubDepartment', (req, res) => {
    console.log('inside sub_departments');
    console.log(req.query.departmentId);
    connection.query('select id, name from sub_departments where department_id = ?', [req.query.departmentId], function (error, results, fields) {
        if (error) {
            console.log(error);
            sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
        } else {
            console.log(results);
            sendResponse.sendSuccessData(results, res); // send successfull data submission response
        }
    });
});

router.get('/getSubCategory', (req, res) => {
    console.log('getSubCategory');

    connection.query('select id, name from sub_category where sub_department_id = ?', [req.query.subDepartmentId], function (error, results, fields) {
        if (error) {
            console.log(error);
            sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
        } else {
            console.log(results);
            sendResponse.sendSuccessData(results, res); // send successfull data submission response
        }
    });
});

router.get('/getBrands', (req, res) => {
    connection.query('select id, name from brands', function (error, results, fields) {
        if (error) {
            console.log(error);
            sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
        } else {
            console.log(results);
            sendResponse.sendSuccessData(results, res); // send successfull data submission response
        }
    });
});

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

