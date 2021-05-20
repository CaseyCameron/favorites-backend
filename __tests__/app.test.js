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
    let user2;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Gif Lover',
          email: 'lover@gif.com',
          password: 'sekrit'
        });
      
      const response2 = await request 
        .post('/api/auth/signup')
        .send({
          name: 'Casey',
          email: 'ham@sandwich.com',
          password: 'password'
        });

      expect(response.status).toBe(200);
      expect(response2.status).toBe(200);

      user = response.body;
      user2 = response2.body;

    });

    let favorite = {
      id: expect.any(Number),
      preview: 'https://media3.giphy.com/media/EKoMfzEg4gnMFdFuBz/giphy-preview.mp4?cid=290d7897jbio7vzt04nv0np6y624s2mf95qg1id55qaoqin1&rid=giphy-preview.mp4&ct=g',
      gif: 'https://media3.giphy.com/media/EKoMfzEg4gnMFdFuBz/giphy.gif?cid=290d7897jbio7vzt04nv0np6y624s2mf95qg1id55qaoqin1&rid=giphy.gif&ct=g',
      giphyId: 'EKoMfzEg4gnMFdFuBz',
      url: 'https://gph.is/g/Z7Gx2gR'
    };

    it('POST favorite to /api/favorites', async () => {
     

      const response = await request
        .post('/api/favorites')
        .set('Authorization', user.token)
        .send(favorite);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        userId: user.id,
        ...favorite
      });

      favorite = response.body;
    });

    it('GET my favorites from /api/me/favorite', async () => {
      // post a favorite from user2
      const favorite = {
        preview: 'https://media3.giphy.com/media/EKoMfzEg4gnMFdFuBz/giphy-preview.mp4?cid=290d7897jbio7vzt04nv0np6y624s2mf95qg1id55qaoqin1&rid=giphy-preview.mp4&ct=g',
        gif: 'https://media3.giphy.com/media/EKoMfzEg4gnMFdFuBz/giphy.gif?cid=290d7897jbio7vzt04nv0np6y624s2mf95qg1id55qaoqin1&rid=giphy.gif&ct=g',
        giphyId: 'EKoMfzEg4gnMFdFuBz',
        url: 'https://gph.is/g/Z7Gx2gR'
      };

      const otherFav = await request
        .post('/api/favorites')
        .set('Authorization', user2.token)
        .send(favorite);
      
      expect(otherFav.status).toBe(200);

      // get all of user1's favorites and make sure the user2's post isn't there
      const response = await request
        .get('/api/me/favorites')
        .set('Authorization', user.token);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.not.arrayContaining([otherFav.body]));

    });

    it('DELETE favorite to /api/favorites/:id', async () => {
      

      const response = await request
        .delete(`/api/favorites/${favorite.id}`)
        .set('Authorization', user.token)
        .send(favorite);

      expect(response.status).toBe(200);

      expect(response.body).toEqual(favorite);
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

