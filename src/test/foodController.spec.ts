import request from 'supertest';
import express, { Application } from 'express';
import { FoodRouter } from '../routes/FoodRouter';

describe('FoodController', () => {
    let app: Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        const foodRouter = new FoodRouter();
        app.use('/api/v1', foodRouter.router);
    });

    describe('GET /api/v1/nearby', () => {
        it('should return nearby food trucks', async () => {
            const res = await request(app)
                .get('/api/v1/nearby')
                .query({ latitude: 37.7749, longitude: -122.4194 });

            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('trucks');
            expect(res.body.trucks).toBeInstanceOf(Array);
        });

        it('should return 400 if latitude and longitude are not provided', async () => {
            const res = await request(app)
                .get('/api/v1/nearby');

            expect(res.status).toEqual(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET /api/v1/foodtrucks/search', () => {
        it('should return food trucks based on advanced search criteria', async () => {
            const res = await request(app)
                .get('/api/v1/foodtrucks/search')
                .query({ foodType: 'pizza' });

            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('trucks');
            expect(res.body.trucks).toBeInstanceOf(Array);
        });
    });
});
