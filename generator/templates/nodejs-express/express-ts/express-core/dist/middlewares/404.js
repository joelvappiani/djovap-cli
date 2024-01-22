"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (req, res) => {
    throw new Error('Route not found');
};
exports.notFound = notFound;
