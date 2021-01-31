import Models from '../models';
import validateWrapper from "../utils/validateWrapper";
import Joi from "joi";
import pkg from "sequelize";

const {Op} = pkg;

export const getPorts = async (rawInput)=>{
    const validate = validateWrapper(
        Joi.object({
            portName:Joi.string()
        })
    );
    const input = validate(rawInput);

    const where={

    };

    if(input.portName){
        where.portNameNormalized={
            [Op.like]: `%${input.portName.toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")}%`
        }
    }
    console.log(where);
    const ports =await Models.Port.findAll({
        where:where,
        limit:20
        ,
        orderBy: 'portNameNormalized'
    })
    return ports;
}
