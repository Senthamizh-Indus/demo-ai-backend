import {DataSource } from 'typeorm';
import "reflect-metadata"; 

import config from './config/ormconfig';

export const dbCreateConnection = new DataSource(config);
