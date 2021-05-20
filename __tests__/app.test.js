import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';
import { mungeGiphy } from '../utils/munge-data.js';
import giphyObj from '../data/example.js';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/me/gifs', () => {
    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Gif Lover',
          email: 'lover@gif.com',
          password: 'sekrit'
        });

      expect(response.status).toBe(200);

      user = response.body;


    });

    // append the token to your requests:
    //  .set('Authorization', user.token);

    it('POST favorite to /api/favorites', async () => {
      const favorite = {
        preview: 'https://media3.giphy.com/media/EKoMfzEg4gnMFdFuBz/giphy-preview.mp4?cid=290d7897jbio7vzt04nv0np6y624s2mf95qg1id55qaoqin1&rid=giphy-preview.mp4&ct=g',
        gif: 'https://media3.giphy.com/media/EKoMfzEg4gnMFdFuBz/giphy.gif?cid=290d7897jbio7vzt04nv0np6y624s2mf95qg1id55qaoqin1&rid=giphy.gif&ct=g',
        giphyId: 'EKoMfzEg4gnMFdFuBz',
        url: 'https://gph.is/g/Z7Gx2gR'
      }

      const response = await request
        .post('/api/favorites')
        .set('Authorization', user.token)
        .send(favorite);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: expect.any(Number),
        userId: user.id,
        ...favorite
      });

      // Update local client favorite object
      //favorite = response.body;
    });

  });

});

describe('Data munging', () => {

  it('munges our giphy data', async () => {
    const expected = {
      'gif': 'https://media4.giphy.com/media/3o7bu2s4p3ydnZ1WVy/giphy.gif?cid=290d7897flmb00fo5e6dyxapbzbe6m7t292ylgf60bf44c18&rid=giphy.gif&ct=g',
      'giphyId': '3o7bu2s4p3ydnZ1WVy',
      'preview': 'https://media4.giphy.com/media/3o7bu2s4p3ydnZ1WVy/giphy-preview.mp4?cid=290d7897flmb00fo5e6dyxapbzbe6m7t292ylgf60bf44c18&rid=giphy-preview.mp4&ct=g',
      'url': 'http://gph.is/2t6dZH7',
    };

    const actual = mungeGiphy(giphyObj);
    expect(actual).toEqual([expected]);

  });

});

