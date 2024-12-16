"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var authMiddleware_1 = require("../../src/middleware/authMiddleware");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe('Authentication Middleware', function () {
    it('should validate a valid token', function () {
        var mockToken = jsonwebtoken_1.default.sign({ userId: '123' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        var req = {
            headers: { authorization: "Bearer ".concat(mockToken) }
        };
        var res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        var next = jest.fn();
        (0, authMiddleware_1.authMiddleware)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(req.user).toBeDefined();
    });
    it('should reject an invalid token', function () {
        var req = {
            headers: { authorization: 'Bearer invalidtoken' }
        };
        var res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        var next = jest.fn();
        (0, authMiddleware_1.authMiddleware)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });
});
