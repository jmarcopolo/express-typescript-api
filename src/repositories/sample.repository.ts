import {injectable} from 'inversify';
import {mongoDatabase, SampleDTO, SampleMongoSchema, SampleDbSchema} from '../models/sample.schema';
import {logger} from '../utils/Logger';
import {createConnection, Connection, Repository, ConnectionOptions} from 'typeorm';

export interface SampleRepository {
	findAll(): Promise<Array<SampleDTO>>;
	create(sampleDTO: SampleDTO): Promise<SampleDTO>;
	update(sampleDTO: SampleDTO): Promise<SampleDTO>;
	find(id: string): Promise<SampleDTO>;
}

@injectable()
export class SampleRepositoryImplMongo implements SampleRepository {
	public async findAll(): Promise<Array<SampleDTO>> {
		const sampleDTOs = await mongoDatabase.connect().then(() => mongoDatabase.samples.find());
		return sampleDTOs.toArray();
	}

	public async create(sampleDTO: SampleDTO): Promise<SampleDTO> {
		return await mongoDatabase.connect().then(() => mongoDatabase.samples.create(sampleDTO));
	}

	public async update(sampleDTO: SampleDTO): Promise<SampleDTO> {
		const dto: SampleMongoSchema = await mongoDatabase.connect()
			.then(() => mongoDatabase.samples.findOne(sampleDTO._id));

		dto.Sample1 = sampleDTO.sample1;
		if (sampleDTO.sample2) {
			dto.sample2 = sampleDTO.sample2;
		} else {
			// undefined isn't handled by mongo, so set to null
			dto.sample2 = null;
		}
		dto.city = sampleDTO.city;
		dto.city = sampleDTO.city;
		dto.zip = sampleDTO.zip;
		dto.country = sampleDTO.country;

		const saved = await dto.save((err: Error, a: SampleDTO) => {
			if (err) {
				logger.error('Error updating Sample: ' + err);
				throw err;
			}
			return a;
		});

		return saved;
	}

	public async find(id: string): Promise<SampleDTO> {
		return await mongoDatabase.connect().then(() => mongoDatabase.samples.findOne(id));
	}
}

@injectable()
export class SampleRepositoryImplDb implements SampleRepository {
	private sampleRepository: Repository<SampleDbSchema>;

	constructor() {
		this.connect().then(async connection => {
			this.sampleRepository = connection.getRepository(SampleDbSchema);
		}).catch(err => logger.error('Cannot connect to database', err));
	}

	public async findAll(): Promise<Array<SampleDTO>> {
		return await this.sampleRepository.find();
	}

	public async create(sampleDTO: SampleDTO): Promise<SampleDTO> {
		return await this.sampleRepository.persist(sampleDTO);
	}

	public async update(sampleDTO: SampleDTO): Promise<SampleDTO> {
		return await this.sampleRepository.persist(sampleDTO);
	}

	public async find(id: string): Promise<SampleDTO> {
		return await this.sampleRepository.findOneById(id);
	}

	private connect(): Promise<Connection> {
		return createConnection(<ConnectionOptions> {
			driver: {
				type: 'sqlite',
				storage: 'tmp/sqlitedb.db'
			},
			logging: {
				logQueries: true,
				logSchemaCreation: true
			},
			autoSchemaSync: true,
			entities: [
				SampleDbSchema
			]
		});
	}
}
