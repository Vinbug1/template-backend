import { authMiddleware } from '../../src/middleware/authMiddleware';
import jwt from 'jsonwebtoken';

describe('Authentication Middleware', () => {
  it('should validate a valid token', () => {
    const mockToken = jwt.sign({ userId: '123' }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    
    const req: any = {
      headers: { authorization: `Bearer ${mockToken}` }
    };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    authMiddleware(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
  });

  it('should reject an invalid token', () => {
    const req: any = {
      headers: { authorization: 'Bearer invalidtoken' }
    };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    authMiddleware(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
  });
}); 