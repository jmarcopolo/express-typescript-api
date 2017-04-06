import * as path from 'path';

const defaultEnvironment = 'development';
const appEnvironments = [
	'development',
	'production'
];

const environment = (process.env.NODE_ENV) ? process.env.NODE_ENV.toLowerCase() : undefined;
let settings = (appEnvironments.indexOf(environment) >= 0) ? require(path.join('./../config', environment)) :
	require(path.join('./../config', defaultEnvironment));


export default settings;
