"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    res.status(500).send(err);
    next(err);
    throw new Error('Something went wrong');
};
exports.errorHandler = errorHandler;
