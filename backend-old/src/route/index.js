const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})
const upload = multer({
    storage:storage
})

const authRoute = require('./authRoute');
const sliderRoute = require('./sliderRoute');
const productRoute = require('./productRoute');
const product_imageRoute = require('./product_imageRoute');
const router = express.Router();

const authCustomerRoute = require('./authCustomersRoute');
const categoriesRoute = require('./categoriesRoute');
const customersRoute = require('./customersRoute');
const cartRoute = require('./cartRoute');

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/sliders',
        route: sliderRoute,
    },
    {
        path: '/products',
        route: productRoute,
    },
    {
        path: '/Product_image',
        route: product_imageRoute,
    },
    {
        path: '/auth-customers',
        route: authCustomerRoute,
    },
    {
        path: '/sliders',
        route: sliderRoute,
    },
    {
        path: '/categories',
        route: categoriesRoute,
    },
    {
        path: '/customers',
        route: customersRoute,
    },
    {
        path: '/cart',
        route: cartRoute,
    },
    {
        path: '/raja-ongkir',
        route: require('./rajaOngkirRoute'),
    },
    {
        path: '/tripay',
        route: require('./tripayRoute'),
    },
    {
        path: '/transaction',
        route: require('./transactionRoute'),
    },
    {
        path: '/statistic',
        route: require('./statisticRoute'),
    }
];

defaultRoutes.forEach((route) => {
    console.log(route.path);
    router.use(route.path, route.route);
});

router.post("/upload", upload.single("file"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const destination = req.file.destination.replace("public/", "");
    res.json({
        message: "Upload file success",
        data: {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            encoding: req.file.encoding,
            mimetype: req.file.mimetype,
            destination: destination,
            filename: req.file.filename,
            path: destination + req.file.filename,
            size: req.file.size,
        }
    });
});

module.exports = router;
