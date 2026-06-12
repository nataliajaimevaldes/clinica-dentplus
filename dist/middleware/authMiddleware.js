import 'express-session';
export const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    }
    else {
        res.redirect('/login');
    }
};
export const isLoggedOut = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        next();
    }
    else {
        res.redirect('/affiliates');
    }
};
