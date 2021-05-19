/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {

    /*
      preview: obj.images.preview.mp4
      gif: obj.images.original.url
      giphy_id: obj.id
      url: obj.bitly_url
    */

    // run a query to create tables
    await client.query(` 
      CREATE TABLE users (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(512) NOT NULL,
        email VARCHAR(512) NOT NULL,
        hash VARCHAR(512) NOT NULL
      );
    
      CREATE TABLE favorites (
        id SERIAL PRIMARY KEY NOT NULL,
        preview VARCHAR(1024) NOT NULL, 
        gif VARCHAR(1024) NOT NULL,
        giphy_id VARCHAR(256) NOT NULL,
        url VARCHAR(1024) NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id)
      );
    `);

    console.log('create tables complete');
  }
  catch (err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}