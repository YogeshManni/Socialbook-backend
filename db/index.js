var pg = require("pg");
const dotenv = require("dotenv");
const deleteOldStories = require("../lib/cleanup");
dotenv.config();

module.exports = class appDb {
  constructor() {
    console.log(process.env.DB_USER);
    this.db = new pg.Client({
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    this.db.connect((err) => {
      if (!err) {
        console.log("Successfully connected to db!");

        this.createTables();
      } else {
        console.log("error occured connecting to db!");
        console.log(err);
      }
    });
  }

  createTables() {
    let sql = `
        BEGIN;

        create table if not exists users(id serial primary key, username text, datejoined timestamptz, img text, phoneno text, email text, org text, role text,  fullname text, password text);
     
        create table if not exists comments(id serial primary key, discussionid int, username text, comment text, date timestamptz, type text);
     
        create table if not exists posts(id serial primary key,
        username text, email text,likes int, img text, caption text,
        date timestamptz, liked_users text[], type text, story BOOLEAN DEFAULT FALSE);

        create table if not exists events(id serial primary key, fronttext text, img text, avtSrc text,  
            userName text, content text, likes int, views int, date timestamptz);
     
        create table if not exists discussions(id serial primary key,date timestamptz, username text ,name text 
        );

        create table if not exists discussionData(id serial primary key, discussionId int, commentId int, name text, discussion text, likes int, date timestamptz);
        
        CREATE TABLE if not exists messages(
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    from_user INTEGER,
    to_user INTEGER,
    timestamp timestamptz  DEFAULT CURRENT_TIMESTAMP
);

        COMMIT;`;
    this.run(sql);

    deleteOldStories();
    // Schedule deletion every 12 hours (12 * 60 * 60 * 1000 ms)
    setInterval(deleteOldStories, 12 * 60 * 60 * 1000);
  }
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.query(sql, params, (err, res) => {
        if (err) {
          console.log("error running sql" + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(res.rows);
        }
      });
    });
  }
  stop() {
    this.db.end();
  }
};
