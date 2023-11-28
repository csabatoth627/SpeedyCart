import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler'
import User from '../models/userModel'

const protect = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = User.findById(decoded.userID).select('-password');
            next();
        } catch (error) {
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    } else {
        res.status(401)
        throw new Error('Not authorized, no token ')
    }
});


const admin = async (req, res, next) => {
    try {
        if (req.user && req.isAdmin) {
            next()
        }
    } catch (error) {
        res.status(401)
        throw new Error('Not authorized as admin ')
    }
};

export {protect,admin};

