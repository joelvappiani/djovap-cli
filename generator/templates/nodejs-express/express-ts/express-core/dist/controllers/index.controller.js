"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexController = void 0;
const index_service_1 = require("../services/index.service");
const indexService = new index_service_1.IndexService();
class IndexController {
    landingPage(req, res) {
        try {
            res.status(200).send('Express API');
        }
        catch (error) {
            res.status(500).send(error);
        }
    }
    testWorking(req, res) {
        try {
            const randomNumber = indexService.generateRandomNumber();
            res.status(200).json({ result: true, message: 'API Working!', randomNumber });
        }
        catch (error) {
            res.status(500).send(error);
        }
    }
}
exports.IndexController = IndexController;
