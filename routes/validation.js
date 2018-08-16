const Joi = require('joi');
var sendResponse = require('./sendresponse');

const adminSchema = Joi.object().keys({
    firstName: Joi.string().alphanum().min(3).max(30).required(),
    lastName: Joi.string().alphanum().min(3).max(30).required(),
    contactNumber: Joi.string().regex(/^\d{10}$/).required(),
    emailId: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required(),
});

const loginSchema = Joi.object().keys({
    emailOrPhone: [Joi.string().email({ minDomainAtoms: 2 }), Joi.string().regex(/^\d{10}$/)],
    password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required(),
});

const changePasswordSchema = Joi.object().keys({
    id: Joi.number().integer().required().required(),
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required(),
});

exports.validateAdminRegister = function (res, values, callback) {
    console.log('inside joi validation');
    Joi.validate({ firstName: values[0], lastName: values[1], contactNumber: values[2], emailId: values[3], password: values[4] }, adminSchema, function (err, value) {
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
    Joi.validate({ id: values[0], currentPassword: values[1], newPassword: values[2] }, changePasswordSchema, function (err, value) {
        if (err) {
            console.log(err);
            sendResponse.sendErrorMessage('Some Parameter Missing or invalid input', res);
        } else {
            callback(null);
        }
    });
}

exports.validateForgetPassword = function(res, values, callback) {
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