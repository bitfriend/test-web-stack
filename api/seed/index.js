'use strict';

require('dotenv').config();
const short = require('short-uuid');
const faker = require('faker');
const moment = require('moment');
const { escapeSql } = require('../src/helpers');

const mysql = require('mysql');
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

conn.connect();

conn.query('CREATE TABLE IF NOT EXISTS users (\
  id varchar(255) NOT NULL,\
  name varchar(255) NOT NULL,\
  dob varchar(255),\
  address varchar(255),\
  description varchar(255) NOT NULL,\
  created_at varchar(255),\
  updated_at varchar(255),\
  PRIMARY KEY (id)\
); ');

for (let i = 0; i < 100; i++) {
  const id = short.generate();
  const name = faker.name.findName();
  const dob = faker.date.past(10, new Date(2001, 0, 1)); // 1991 ~ 2000
  const city = faker.address.city();
  const state = faker.address.state();
  const zipCode = faker.address.zipCode();
  const address = escapeSql(`${city} ${state} ${zipCode}`);
  const description = faker.lorem.sentence(10);
  const createdAt = faker.date.past(10, new Date(2001, 0, 1));
  const updatedAt = faker.date.past(10, new Date(2001, 0, 1));
  const text = `INSERT INTO users (\
    id, name, dob, address, description, created_at, updated_at\
  ) VALUES (\
    '${id}',\
    '${escapeSql(name)}',\
    '${moment.utc(dob).format()}',\
    '${address}',\
    '${escapeSql(description)}',\
    '${moment.utc(createdAt).format()}',\
    '${moment.utc(updatedAt).format()}'\
  )`;
  conn.query(text);
}

conn.end();
