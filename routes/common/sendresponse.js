
var failedStatus = 204;
var successStatus = 200;
// send success message
exports.sendSuccessData = function (data, res) {
    var successResponse = {
        status: successStatus,
        message: "success",
        data: data
    };
    res.send(successResponse);
};
// send error message
exports.sendErrorMessage = function (msg, res) {
    var errResponse = {
        status:failedStatus,
        message: msg,
        data: {}
    };
    res.send(errResponse);
};
