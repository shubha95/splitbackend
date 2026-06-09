"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = exception.getStatus();
        const raw = exception.getResponse();
        let message = 'An error occurred';
        let errors = [];
        if (typeof raw === 'string') {
            message = raw;
        }
        else if (typeof raw === 'object') {
            const rawMessage = raw.message;
            if (statusCode === 422 && Array.isArray(rawMessage)) {
                message = 'Validation failed';
                errors = rawMessage;
            }
            else if (statusCode === 409 &&
                rawMessage &&
                typeof rawMessage === 'object' &&
                rawMessage.field) {
                message = rawMessage.message;
                errors = [{ field: rawMessage.field, message: rawMessage.message }];
            }
            else {
                message =
                    typeof rawMessage === 'string'
                        ? rawMessage
                        : JSON.stringify(rawMessage);
            }
        }
        response.status(statusCode).json({
            success: false,
            statusCode,
            message,
            errors,
            data: null,
        });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map