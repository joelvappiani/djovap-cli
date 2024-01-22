"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_controller_1 = require("../controllers/index.controller");
const router = express_1.default.Router();
const indexController = new index_controller_1.IndexController();
router.get('/', indexController.landingPage);
router.get('/test', indexController.testWorking);
exports.default = router;
