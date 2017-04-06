import { Request } from '../http/request';
import { Response } from '../http/response';
import * as exampleModel from './../models/example';

export function index(request: Request, response: Response, next: Function) {
	exampleModel.get((error, results: any) => {
		if (error) {
			return next(error);
		}

		if (results) {
			response.payload = results;
		}

		next();
	});
}
