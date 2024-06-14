const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../helper/ApiError');

const verifyCallback = (req, res, resolve, reject) => {
    return async (err, user, info) => {
        console.log(user)
        if (err || info || !user) {
            return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
        }
        req.user = user;

        resolve();
    };
};

const auth = (access = 'admins') => {
    return async (req, res, next) => {
        return new Promise((resolve, reject) => {
            passport.authenticate(
                'jwt',
                { session: false },
                verifyCallback(req, res, resolve, reject),
            )(req, res, next);
        })
            .then((respose) => {
                if (req.user.role !== access) {
                    // console
                    console.log('masok')
                    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
                }
                
                return next();
            })
            .catch((err) => {
                console.log('wasyu', err)
                return next(err);
            });
    };
};

module.exports = auth;
