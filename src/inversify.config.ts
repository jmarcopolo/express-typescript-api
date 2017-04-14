import {Container} from 'inversify';
import TYPES from './types';
import {SampleService, SampleServiceImpl} from './services/sample.service';
import {SampleRepository, SampleRepositoryImplMongo, SampleRepositoryImplDb} from './repositories/sample.repository';
import {SampleController} from './controllers/sample.controller';
import {RegistrableController} from './controllers/registerable.controller';

const container = new Container();
container.bind<RegistrableController>(TYPES.Controller).to(SampleController);
container.bind<SampleService>(TYPES.SampleService).to(SampleServiceImpl);
container.bind<SampleRepository>(TYPES.SampleRepository).to(SampleRepositoryImplMongo);
container.bind<SampleRepository>(TYPES.SampleRepository2).to(SampleRepositoryImplDb);

export default container;
