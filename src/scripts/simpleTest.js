import * as aisService from '../services/ais';
import * as portService from '../services/port';
import moment from 'moment';
import Models from '../models';

const c = async ()=>{

    const c = await portService.getPorts({portName:'londo'});

}

c();
