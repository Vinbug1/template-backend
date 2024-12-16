import request from 'supertest';
import app from '../src/app';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

describe('Profile Endpoints', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Create a test user and generate token
    const user = await User.create({
      username: 'profileuser',
      email: 'profile@example.com',
      password: 'password123'
    });

    userId = user._id;
    authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  });

  describe('GET /api/profile', () => {
    it('should retrieve user profile', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('username', 'profileuser');
    });

    it('should reject unauthorized access', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', 'Bearer invalidtoken');
      
      expect(response.statusCode).toBe(401);
    });
  });

  describe('PUT /api/profile', () => {
    it('should update user profile', async () => {
      const response = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'updatedusername',
          bio: 'New bio description'
        });
      
      expect(response.statusCode).toBe(200);
      expect(response.body.username).toBe('updatedusername');
    });
  });
}); 