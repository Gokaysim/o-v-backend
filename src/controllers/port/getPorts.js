import * as portService from '../../services/port';

export default async (req,res,next)=>{
    try{
        const ports = await portService.getPorts({...(req.query||{})});
        res.json(ports);
    }catch(err){
        next(err);
    }
}
