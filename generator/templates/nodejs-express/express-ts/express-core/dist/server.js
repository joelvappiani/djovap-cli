"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const { NODE_ENV, PORT } = config_1.envConfig;
app_1.default.listen(PORT, () => {
    console.log(`NODE_ENV=${NODE_ENV}`);
    console.log(`Server connected on port ${PORT}`);
});
