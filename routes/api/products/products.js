const express = require('express');
const async = require('async');
var moment = require('moment');
const router = express.Router();
const connection = require('../../../config/database.config');
var validate = require('../../common/validation')
var func = require('../../common/commonfunction'); // call common fuctions
var sendResponse = require('../../common/sendresponse'); // send response to user
var sendProductList = require('./sendProductList');
// Api call
router.post('/addProduct', (req, res) => {
    console.log('Inside admin file');
    console.log(req.body);
    console.log(req.body.accessToken);

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
        req.body.dimensionLength,
        req.body.dimensionWidth,
        req.body.dimensionHeight,
        req.body.shippingClassId,
        req.body.upsells,
        req.body.crossSells,
        req.body.longDescription,
        req.body.additionalInfo,
        req.body.help,
        req.body.tagId,
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
            // check if product allready added
            func.checkExistingProduct(res, req.body.productName, callback);
        },
    ],
        function () {
            console.log('Save product');
            let post = {
                department_id: req.body.departmentId,
                sub_department_id: req.body.subDepartmentId,
                sub_category_Id: req.body.subCategoryId,
                // product_id: req.body.productId,
                product_name: req.body.productName,
                brand_id: req.body.brandId,
                description: req.body.description,
                regular_price: req.body.regularPrice,
                sale_price: req.body.salePrice,
                tax_status_id: req.body.taxStatusId,
                tax_class_id: req.body.taxClassId,
                sku: req.body.sku,
                manage_stock: req.body.manageStock,
                stock_status_id: req.body.stockStatusId,
                sold_individually: req.body.soldIndv,
                weight: req.body.weight,
                dimension_length: req.body.dimensionLength,
                dimension_width: req.body.dimensionWidth,
                dimension_height: req.body.dimensionHeight,
                shipping_class_id: req.body.shippingClassId,
                upsells: req.body.upsells,
                cross_sells: req.body.crossSells,
                long_description: req.body.longDescription,
                additional_info: req.body.additionalInfo,
                help: req.body.help,
                tag_id: req.body.tagId,
                created_at: moment.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            connection.query('INSERT INTO products SET ?', post, function (error, results, fields) {
                if (error) {
                    console.log(error);
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
                } else {
                    console.log(results);
                    results.departmentId = req.body.departmentId,
                        results.subDepartmentId = req.body.subDepartmentId,
                        sendResponse.sendSuccessData(results, res); // send successfull data submission response
                }
            });
        }
    )
});

router.get('/productList', (req, res) => {
    console.log('in get products request');
    console.log('departmentId = ' + req.query.departmentId + '  subDepartmentId = ' + req.query.subDepartmentId + ' subCategory = ' + req.query.subCategory);
    let param = [];
    let query = 'select products.id, departments.name as departmentName, sub_departments.name as subDepartmentName, sub_category.name as subCategoryName,' +
        'products.product_name, brands.name as brandName, products.description, products.regular_price, products.sale_price, tax_status.name AS taxStatusName, tax_class.name AS taxClassName, ' +
        'products.sku, products.manage_stock, stock_status.status, sold_individually, weight, dimension_length, dimension_width, dimension_height, shipping_class.name as shippingClass, upsells, ' +
        'cross_sells, long_description, additional_info, products.help, tags.tag, products.main_image_path, products.auxillary_image_path' +
        ' from products LEFT JOIN departments ON products.department_id = departments.id ' +
        'LEFT JOIN sub_departments ON products.sub_department_id = sub_departments.id LEFT JOIN sub_category ON products.sub_category_id = sub_category.id ' +
        'LEFT JOIN brands ON products.brand_id = brands.id LEFT JOIN tax_status ON products.tax_status_id = tax_status.id LEFT JOIN tax_class ON products.tax_class_id = tax_class.id ' +
        'LEFT JOIN stock_status ON products.stock_status_id = stock_status.id LEFT JOIN shipping_class ON products.shipping_class_id = shipping_class.id LEFT JOIN tags ON products.tag_id = tags.id';

    if (req.query.departmentId && !req.query.subDepartmentId && !req.query.subCategory) {
        query = query + ' where products.department_id = ?';
        param.push(req.query.departmentId);
        console.log('cond 1');

    } else if (req.query.departmentId != undefined && req.query.subDepartmentId != undefined && !req.query.subCategory) {
        query = query + ' where products.department_id = ? AND products.sub_department_id = ?';
        param = [req.query.departmentId, req.query.subDepartmentId];
        console.log('cond 2');

    } else if (req.query.departmentId && req.query.subDepartmentId && req.query.subCategory) {
        query = query + ' where products.department_id = ? AND products.sub_department_id = ? AND sub_category_id = ?';
        param = [req.query.departmentId, req.query.subDepartmentId, req.query.subCategoryId];
        console.log('cond 3');
    }
    // else {
    //     query = 'select products.id, departments.name as departmentName, sub_departments.name as subDepartmentName, sub_category.name as subCategoryName, products.product_name, brands.name as brandName from products LEFT JOIN departments ON products.department_id = departments.id AND LEFT JOIN sub_departments ON products.sub_department_id = sub_departments.id AND LEFT JOIN sub_category ON products.sub_category_id = sub_category.id AND LEFT JOIN brands ON products.brand_id = brands.id';
    // }
    console.log(param);
    console.log(query);
    connection.query(query, param, function (error, results, fields) {
        if (error) {
            console.log(error);
            sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
        } else {
            console.log('Print queryr result');
            console.log(results);
            sendProductList.formatData(results, res);
            // sendResponse.sendSuccessData(results, res); // send successfull data submission response
        }
    });
})

// Api call
router.get('/updateRequires', (req, res) => {
    console.log('in update requires');
    if (!req.query.productId) {
        sendResponse.sendErrorMessage('Some parameter missing', res); // send err message if unable to save data 
    } else {
        connection.query('select products.department_id, products.sub_department_id, products.sub_category_id, products.brand_id, products.tax_status_id, products.tax_class_id, products.stock_status_id, products.shipping_class_id, products.tag_id from products where id = ?', [req.query.productId], function (error, results, fields) {
            if (error) {
                console.log(error);
                sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
            } else {
                console.log(results);
                sendResponse.sendSuccessData(results, res); // send successfull data submission response
            }
        });
    }
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
        req.body.dimensionLength,
        req.body.dimensionWidth,
        req.body.dimensionHeight,
        req.body.shippingClassId,
        req.body.upsells,
        req.body.crossSells,
        req.body.longDescription,
        req.body.additionalInfo,
        req.body.help,
        req.body.tagId,
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
            manValues.push(req.body.productId);
            connection.query('update products SET department_id = ?, sub_department_id = ?, sub_category_id = ?,  product_name = ?, ' +
                'brand_id = ?, description = ?, regular_price = ? ,sale_price = ?, ' +
                'tax_status_id = ?, tax_class_id = ?, sku = ?, manage_stock = ?, stock_status_id = ?, ' +
                'sold_individually = ?, weight = ?, dimension_length = ?, dimension_width = ?, dimension_height = ?, shipping_class_id = ?, ' +
                'upsells = ?, cross_sells = ?, long_description = ?, additional_info = ?, help = ?, tag_id = ?, updated_at = ? where id = ?', manValues, function (error, results, fields) {
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



router.post('/deleteProduct', (req, res) => {
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
            connection.query('delete from products where id = ?', [req.body.productId], function (error, results, fields) {
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

router.get('/getTaxStatus', (req, res) => {
    console.log('Inside tax Status');
    connection.query('select id, name from tax_status', function (error, results, fields) {
        if (error) {
            console.log(error);
            sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
        } else {
            console.log(results);
            sendResponse.sendSuccessData(results, res); // send successfull data submission response
        }
    });
});

router.get('/getTaxClass', (req, res) => {
    console.log('Inside tax Status');
    connection.query('select id, name from tax_class', function (error, results, fields) {
        if (error) {
            console.log(error);
            sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
        } else {
            console.log(results);
            sendResponse.sendSuccessData(results, res); // send successfull data submission response
        }
    });
});

// getStockStatus
router.get('/getStockStatus', (req, res) => {
    console.log('Inside tax Status');
    connection.query('select id, status from stock_status', function (error, results, fields) {
        if (error) {
            console.log(error);
            sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
        } else {
            console.log(results);
            sendResponse.sendSuccessData(results, res); // send successfull data submission response
        }
    });
});

// getStockStatus
router.get('/getTags', (req, res) => {
    console.log('Inside tax Status');
    connection.query('select id, tag from tags', function (error, results, fields) {
        if (error) {
            console.log(error);
            sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
        } else {
            console.log(results);
            sendResponse.sendSuccessData(results, res); // send successfull data submission response
        }
    });
});

module.exports = router;

