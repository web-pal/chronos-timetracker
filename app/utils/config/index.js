import devConfig from './config.development.js';
import prodConfig from './config.production.js';

const config = process.env.NODE_ENV === 'development' ? devConfig : prodConfig;

export default config;
