import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/User';
import bcrypt from 'bcryptjs';

describe('Authentication Endpoints', () => {
  // Setup before tests
  beforeAll(async () => {
    // Initialize the test database or clear existing data
    // e.g., await User.deleteMany({}); if using MongoDB
  });

  afterAll(async () => {
    // Cleanup the database after all tests (optional)
    // e.g., await User.deleteMany({}); if using MongoDB
  });

  // User Registration
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'strongpassword123'
        });
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('token');
    });

    it('should reject registration with existing email', async () => {
      // First, create a user
      await User.create({
        username: 'existinguser',
        email: 'existing@example.com',
        password: await bcrypt.hash('password123', 10)
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'existing@example.com',
          password: 'password123'
        });
      
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Email already exists'); // Assuming this is your error message
    });
  });

  // User Login
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await User.create({
        username: 'loginuser',
        email: 'login@example.com',
        password: await bcrypt.hash('correctpassword', 10)
      });
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'correctpassword'
        });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Invalid credentials'); // Assuming this is your error message
    });
  });
});
