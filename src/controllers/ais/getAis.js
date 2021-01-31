import * as aisService from '../../services/ais';

export default async (req,res,next)=>{
    try{
        const ais = await aisService.getAis({...(req.query||{})});
        res.json(ais);
    }catch(err){
        next(err);
    }
}
