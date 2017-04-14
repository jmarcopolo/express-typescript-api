import { injectable, inject } from 'inversify';
import { Sample } from '../models/sample';
import { SampleRepository } from '../repositories/sample.repository';
import TYPES from '../types';
import 'reflect-metadata';
import { SampleDTO } from '../models/sample.schema';
import * as _ from 'lodash';

export interface SampleService {
	getSamples(): Promise<Array<Sample>>;
	createSample(sample: Sample): Promise<Sample>;
	updateSample(sample: Sample): Promise<Sample>;
	getSample(id: string): Promise<Sample>;
}

@injectable()
export class SampleServiceImpl implements SampleService {
	@inject(TYPES.SampleRepository)
	private sampleRepositoryMongo: SampleRepository;

	@inject(TYPES.SampleRepository2)
	private sampleRepositoryDb: SampleRepository;

	public async getSamples(): Promise<Array<Sample>> {
		// grab Samples from mongo
		const samplesMongo: Array<Sample> = await this.sampleRepositoryMongo.findAll()
			.then((a) => a.map((dto: SampleDTO) => {
			return this.toSampleDTO(dto);
		}));

		// grab Samples from db
		const samplesDb: Array<Sample> = await this.sampleRepositoryDb.findAll()
			.then((a2) => a2.map((dto: SampleDTO) => {
			return this.toSampleDTO(dto);
		}));

		return _.uniqBy(samplesMongo.concat(samplesDb), 'id');
	}

	public async createSample(sample: Sample): Promise<Sample> {
		const sampleDTO: SampleDTO = this.toSample(sample);

		const createdDTO: SampleDTO = await this.sampleRepositoryMongo.create(sampleDTO);

		// duplicates the Sample in the DB
		await this.sampleRepositoryDb.create(await createdDTO);

		return await this.toSampleDTO(createdDTO);
	}

	public async updateSample(sample: Sample): Promise<Sample> {
		const sampleDTO: SampleDTO = this.toSample(sample);

		const updated: SampleDTO = await this.sampleRepositoryMongo.update(sampleDTO);

		// update db Sample
		await this.sampleRepositoryDb.update(updated);

		return await this.toSampleDTO(updated);
	}

	public async getSample(id: string): Promise<Sample> {
		let sample = await this.sampleRepositoryMongo.find(id).then((a) => {
			return this.toSampleDTO(a);
		});

		if (!sample) {
			sample = await this.sampleRepositoryDb.find(id).then((a) => {
				return this.toSampleDTO(a);
			});
		}

		return sample;
	}

	private toSample(sample: Sample): SampleDTO {
		return {
			sample1: sample.getSample1,
			sample2: sample.getSample2,
			city: sample.getCity,
			state: sample.getState,
			zip: sample.getZip,
			country: sample.getCountry,
			_id: sample.getId
		};
	}

	private toSampleDTO(sampleDTO: SampleDTO): Sample {
		return new Sample(
			sampleDTO.sample1,
			sampleDTO.sample2,
			sampleDTO.city,
			sampleDTO.state,
			sampleDTO.zip,
			sampleDTO.country,
			sampleDTO._id.toString());
	}
}
