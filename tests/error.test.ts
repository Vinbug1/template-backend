import request from 'supertest';
import app from '../src/app';

describe('Error Handling', () => {
  it('should handle 404 for non-existent routes', async () => {
    const response = await request(app)
      .get('/api/nonexistent-route');
    
    expect(response.statusCode).toBe(404);
  });

  it('should handle validation errors', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        // Intentionally send invalid data
        email: 'invalid-email'
      });
    
    expect(response.statusCode).toBe(400);
  });
}); 