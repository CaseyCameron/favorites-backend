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

    it('POST /auth/signup', async () => {
      const fail = 'booger';
      console.log(fail);
    }); 

  });


  
});

describe('Data munging', () => {

  it('munges our giphy data', async () => {

    // remove this line, here to not have lint error:
    const expected = {
      'gif': 'https://media4.giphy.com/media/3o7bu2s4p3ydnZ1WVy/giphy.gif?cid=290d7897flmb00fo5e6dyxapbzbe6m7t292ylgf60bf44c18&rid=giphy.gif&ct=g',
      'giphy_id': '3o7bu2s4p3ydnZ1WVy',
      'preview': 'https://media4.giphy.com/media/3o7bu2s4p3ydnZ1WVy/giphy-preview.mp4?cid=290d7897flmb00fo5e6dyxapbzbe6m7t292ylgf60bf44c18&rid=giphy-preview.mp4&ct=g',
      'url': 'http://gph.is/2t6dZH7',
    };

    const actual = mungeGiphy(giphyObj);

    // expect(response.status).toBe(200);
    //expect(response.body).toEqual(exp);

    expect(actual).toEqual([expected]);

  });

});

