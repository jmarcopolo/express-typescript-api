export class Sample {
	constructor( private sample1: string, private sample2: string, private city: string,  private state: string,
			private zip: string, private country: string, private id?: string ) {}

	get getSample1(): string {
		return this.sample1;
	}

	get getSample2(): string {
		return this.sample2;
	}

	get getCity(): string {
		return this.city;
	}

	get getState(): string {
		return this.state;
	}

	get getZip(): string {
		return this.zip;
	}

	get getCountry(): string {
		return this.country;
	}

	get getId(): string {
		return this.id;
	}
}
