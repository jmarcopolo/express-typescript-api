import { Core, Model, Instance, Collection, Index, Property, ObjectID } from 'iridium';
import { Table, Column, PrimaryColumn } from 'typeorm';

export interface SampleDTO {
	_id?: string;
	sample1: string;
	sample2?: string;
	city: string;
	state: string;
	zip: string;
	country: string;
}

/**
 * Iridium config
 */
@Index({name: 1})
@Collection('Samples')
export class SampleMongoSchema extends Instance<SampleDTO, SampleMongoSchema> implements SampleDTO {
	@ObjectID
	// tslint:disable-next-line:variable-name
	public _id: string;
	@Property(String, true)
	public sample1: string;
	@Property(String, false)
	public sample2: string;
	@Property(String, true)
	public city: string;
	@Property(String, true)
	public state: string;
	@Property(String, true)
	public zip: string;
	@Property(String, true)
	public country: string;
}

class SampleDatabase extends Core {
	public samples = new Model<SampleDTO, SampleMongoSchema>(this, SampleMongoSchema);
}

export const mongoDatabase = new SampleDatabase({database: 'test_db'});

// delete everything from mongo
// database.connect().then(() => database.Samples.remove()).then(() => database.Samplees.get())
// .then(() => database.close());

/**
 * TypeORM Schema Config
 */
@Table('Sample')
export class SampleDbSchema implements SampleDTO {
	@PrimaryColumn()
	// tslint:disable-next-line:variable-name
	public _id?: string;
	@Column()
	public sample1: string;
	@Column()
	public sample2?: string;
	@Column()
	public city: string;
	@Column()
	public state: string;
	@Column()
	public zip: string;
	@Column()
	public country: string;
}
