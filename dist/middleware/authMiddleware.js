"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedOut = exports.isLoggedIn = void 0;
require("express-session");
const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    }
    else {
        res.redirect('/login');
    }
};
exports.isLoggedIn = isLoggedIn;
const isLoggedOut = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        next();
    }
    else {
        res.redirect('/affiliates');
    }
};
exports.isLoggedOut = isLoggedOut;
