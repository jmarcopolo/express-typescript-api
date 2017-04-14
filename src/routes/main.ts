'use strict';
import { Router } from 'express';
import * as ExampleController from './../controllers/main.controller';

let router = Router();

router.get('/', ExampleController.index);

module.exports = router;
