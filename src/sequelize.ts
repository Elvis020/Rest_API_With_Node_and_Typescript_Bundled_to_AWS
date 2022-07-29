import {Sequelize} from 'sequelize-typescript';
// import { config } from './config/config';
import * as dotenv from 'dotenv'
dotenv.config()



// Instantiate new Sequelize instance!
export const sequelize = new Sequelize({
  "username": process.env.POSTGRES_USERNAME,
  "password": process.env.POSTGRES_PASSWORD,
  "database": process.env.DATABASE,
  "host":     process.env.AWS_HOST,

  dialect: 'postgres',
  storage: ':memory:',
});

