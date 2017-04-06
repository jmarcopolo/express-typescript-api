import * as _ from 'lodash';
import { Request } from '../http/request';
import { Response } from '../http/response';
import Log from '../lib/log';

export default (log: Log) => {
	return (request: Request, response: Response, next: Function) => {

		if (_.isObject(response.payload)) {
			response.json(response.payload);
		}

		response.status(404).send();
	};
};
