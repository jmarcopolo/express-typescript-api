import { Request } from '../http/request';
import { Response } from '../http/response';
import Log from '../lib/log';

export default (log: Log) => {
	return (error: Error, request: Request, response: Response, next: Function) => {
		response.status(500);
		response.payload = {
			error: error.message
		};

		log.error(error.message);

		next();
	};
};
