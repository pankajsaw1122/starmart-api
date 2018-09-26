var sendResponse = require('../../common/sendresponse'); // send response to user

exports.formatData = (results, res) => {
    let productList = [];
    let productData = {};
    console.log(results);

    results.forEach(function(data) {
        productData = {
            productId: data.id,
            departmentName: data.departmentName,
            subDepartmentName: data.subDepartmentName,
            subCategory: data.subCategory,
            productName: data.product_name,
            brand: data.brandName,
            description: data.description,
            regularPrice: data.regular_price,
            salePrice: data.sale_price,
            taxStatus: data.taxStatusName,
            taxClass: data.taxClassName,
            sku: data.sku,
            manageStock: data.manage_stock == 0 ? 'no' : 'yes',
            stockStatus: data.status,
            soldIndividually: data.sold_individually == 0 ? 'no' : 'yes',
            weight: data.weight,
            dimensionLength: data.dimension_length,
            dimensionWidth: data.dimension_width,
            dimensionHeight: data.dimension_height,
            shippingClass: data.shippingClass,
            upsells: data.upsells,
            crossSells: data.cross_sells,
            longDescription: data.long_description,
            additionalInfo: data.additional_info,
            help: data.help,
            tag: data.tag,
            mainImage: 'http://localhost:5000/' + data.main_image_path,
            auxillaryImage: 'http://localhost:5000/' + data.auxillary_image_path
        }
        productList.push(productData);
    });
    sendResponse.sendSuccessData(productList, res); // send successfull data submission response
}