const Joi = require('joi');
var sendResponse = require('./sendresponse');

const adminSchema = Joi.object().keys({
    firstName: Joi.string().alphanum().min(3).max(30).required(),
    lastName: Joi.string().alphanum().min(3).max(30).required(),
    mobileNumber: Joi.string().regex(/^\d{10}$/).required(),
    emailId: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^(?=.*\d).{6,12}$/).required(),
});

const loginSchema = Joi.object().keys({
    emailOrPhone: [Joi.string().email({ minDomainAtoms: 2 }), Joi.string().regex(/^\d{10}$/)],
    password: Joi.string().regex(/^(?=.*\d).{6,12}$/).required(),
});

const changePasswordSchema = Joi.object().keys({
    accessToken: Joi.string().required(),
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().regex(/^(?=.*\d).{6,12}$/).required(),
});

const otpSchema = Joi.object().keys({
    id: Joi.number().integer().required(),
    otp: Joi.number().integer().required()
});

const resetPasswordSchema = Joi.object().keys({
    accessToken: Joi.string().required(),
    password: Joi.string().regex(/^(?=.*\d).{6,12}$/).required()
});

const productSchema = Joi.object().keys({
    departmentId: Joi.number().integer().required(),
    subDepartmentId: Joi.number().integer().required(),
    subCategoryId: Joi.number().integer().required(),
    // productId: Joi.number().integer().required(),
    productName: Joi.string().alphanum().required(),
    brandId: Joi.number().integer().required(),
    description: Joi.string().required(),
    regularPrice: Joi.number().required(),
    salePrice: Joi.number().required(),
    taxStatusId: Joi.number().integer().required(),
    taxClassId: Joi.number().integer().required(),
    sku: Joi.string(),
    manageStock: Joi.number().integer(),
    stockStatusId: Joi.number().integer().required(),
    soldIndv: Joi.number().integer(),
    weight: Joi.string().required(),
    dimension: Joi.string(),
    shippingClassId: Joi.number().integer().required(),
    upsells: Joi.string(),
    crossSells: Joi.string(),
    longDescription: Joi.string(),
    additionalInfo: Joi.string(),
    help: Joi.string(),
    tags: Joi.number().integer().required(),
    // mainImage: Joi.string().required(),
    // auxillaryImage: Joi.string().required(),
});


exports.validateAdminRegister = function (res, values, callback) {
    console.log('inside joi validation');
    Joi.validate({ firstName: values[0], lastName: values[1], mobileNumber: values[2], emailId: values[3], password: values[4] }, adminSchema, function (err, value) {
        if (err) {
            console.log(err);
            sendResponse.sendErrorMessage('Some Parameter Missing or invalid input', res);
        } else {
            callback(null);
        }
    });
}

exports.validateLoginParameter = function (res, values, callback) {
    console.log('inside joi validation');
    Joi.validate({ emailOrPhone: values[0], password: values[1] }, loginSchema, function (err, value) {
        if (err) {
            console.log(err);
            sendResponse.sendErrorMessage('Some Parameter Missing or invalid input', res);
        } else {
            callback(null);
        }
    });
}

exports.validateChangePassword = function (res, values, callback) {
    console.log('inside joi validation');
    Joi.validate({ accessToken: values[0], currentPassword: values[1], newPassword: values[2] }, changePasswordSchema, function (err, value) {
        if (err) {
            console.log(err);
            sendResponse.sendErrorMessage('Some Parameter Missing or invalid input', res);
        } else {
            callback(null);
        }
    });
}

exports.validateForgetPassword = function (res, values, callback) {
    console.log('inside joi validation');
    Joi.validate(values, [Joi.string().email({ minDomainAtoms: 2 }), Joi.string().regex(/^\d{10}$/)], { presence: "required" }, function (err, value) {
        if (err) {
            console.log(err);
            sendResponse.sendErrorMessage('Some Parameter Missing or invalid input', res);
        } else {
            callback(null);
        }
    });
}

exports.validateOtp = function (res, values, callback) {
    console.log('inside joi validation');
    Joi.validate({ id: values[0], otp: values[1] }, otpSchema, function (err, value) {
        if (err) {
            console.log(err);
            sendResponse.sendErrorMessage('Some Parameter Missing or invalid input', res);
        } else {
            callback(null);
        }
    });
}

exports.validateResetPassword = function (res, values, callback) {
    console.log('inside joi validation');
    Joi.validate({ accessToken: values[0], password: values[1] }, resetPasswordSchema, function (err, value) {
        if (err) {
            console.log(err);
            sendResponse.sendErrorMessage('Some Parameter Missing or invalid input', res);
        } else {
            callback(null);
        }
    });
}

exports.deleteId = function (res, id, callback) {
    console.log('inside joi validation');
    Joi.validate(id, Joi.number().integer().required(), function (err, value) {
        if (err) {
            console.log(err);
            sendResponse.sendErrorMessage('Some Parameter Missing or invalid input', res);
        } else {
            callback(null);
        }
    });
}

exports.validateProduct = function (res, values, callback) {
    console.log('inside joi validation');
    Joi.validate({
        departmentId: values[0], 
        subDepartmentId: values[1],
        subCategoryId: values[2],
        productName: values[3],
        brandId: values[4],
        description: values[5],
        regularPrice: values[6],
        salePrice: values[7],
        taxStatusId: values[8],
        taxClassId: values[9],
        sku: values[10],
        manageStock: values[11],
        stockStatusId: values[12],
        soldIndv: values[13],
        weight: values[14],
        dimension: values[15],
        shippingClassId: values[16],
        upsells: values[17],
        crossSells: values[18],
        longDescription: values[19],
        additionalInfo: values[20],
        help: values[21],
        tags: values[22],
    }, productSchema, function (err, value) {
        if (err) {
            console.log(err);
            sendResponse.sendErrorMessage('Some Parameter Missing or invalid input', res);
        } else {
            callback(null);
        }
    });
}