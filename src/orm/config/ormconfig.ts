import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'mongodb',
  useNewUrlParser: true,
  host: 'localhost',
  port: 27017,
  username: '',
  password: '',
  database: 'demo-project-ai',
  synchronize: true,
  logging: false,
  entities: ['src/entities/**/*.{ts, js}'],
  useUnifiedTopology: true
};

// const config: DataSourceOptions = {
//   type: 'mongodb',
//   useNewUrlParser: true,
//   url: 'mongodb+srv://int-admin:lK1dLyZmkFWBgpqj@senthamizh-int.dynf8.mongodb.net',
//   database: 'demo-project-ai',
//   synchronize: true,
//   logging: false,
//   entities: ['dist/entities/**/*.{ts,js}'],
//   useUnifiedTopology: true
// };

export = config;