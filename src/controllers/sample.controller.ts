import * as express from 'express';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { SampleService } from '../services/sample.service';
import { Sample } from '../models/sample';
import { RegistrableController } from './registerable.controller';

@injectable()
export class SampleController implements RegistrableController {
	private sampleService: SampleService;

	public constructor(@inject(TYPES.SampleService) sampleService: SampleService) {
		this.sampleService = sampleService;
	}

	public register(app: express.Application): void {
		app.route('/')
			.get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
				const samples = await this.sampleService.getSamples().catch(err => next(err));
				res.json(samples);
			})
			.post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
				const sample = new Sample(
					req.body.Sample1,
					req.body.Sample2,
					req.body.city,
					req.body.state,
					req.body.zip,
					req.body.country
				);
				const createdSample = await this.sampleService.createSample(sample).catch(err => next(err));
				res.json(createdSample);
			});

		app.route('/:id')
			.get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
				const samples = await this.sampleService.getSample(<string> req.params.id).catch(err => next(err));
				res.json(samples);
			})
			.put(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
				const sample = new Sample(
					req.body.Sample1,
					req.body.Sample2,
					req.body.city,
					req.body.state,
					req.body.zip,
					req.body.country,
					req.body.id
				);

				const updatedSample = await this.sampleService.updateSample(sample).catch(err => next(err));
				res.json(updatedSample);
			});
	}
}
