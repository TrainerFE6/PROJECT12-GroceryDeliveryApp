const express = require('express');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const routes = require('./route');
const { jwtStrategy } = require('./config/passport');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./helper/ApiError');
const path = require('path');
const fs = require('fs');

process.env.PWD = process.cwd();

const app = express();

// enable cors
app.use(cors());
app.options('*', cors());

app.use(express.static(`${process.env.PWD}/public`));
app.use(express.static(`${process.env.PWD}/logs`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.get('/', async (req, res) => {
    res.status(200).send('Congratulations! Grocery API is working!');
});
app.use('/api', routes);

app.get('/logs', function(req, res){
    // http://localhost:5000/api/logs/?date=2021-09-01
    console.log('req.query.date', req.query.date)
    const date = req.query.date;
    const file = path.resolve(`logs/${date}-app-log.log`); // replace 'yourfile.ext' with your file
    // const file = path.resolve(`logs/tes.jpg`); // replace 'yourfile.ext' with your file
    // const stream = fs.createReadStream(file);

    // stream.pipe(res);
    res.download(file); // Set disposition and send it.
  });

app.get('/uploadss/:filename', function(req, res){
    const filename = req.params.filename; 
    const file = path.resolve(`public_data/uploads/${filename}`); // replace 'yourfile.ext' with your file
    logger.error(file);

    // res.download(file); // Set disposition and send it.
});
// app.use(express.static(path.resolve('public'), { dotfiles: 'allow' }), (req, res) => {
//     res.status(404).send('Not found file 1');
// });
// app.use(express.static(path.join(__dirname, '/public')));


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
const db = require('./models');
const logger = require('./config/logger');

// Uncomment this line if you want to sync database model
// db.sequelize.sync()

module.exports = app;