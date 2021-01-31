import Models from '../models';
import Joi from 'joi';
import Sequelize from '../models/database';
import pkg from 'sequelize';
import validateWrapper from "../utils/validateWrapper";
import csvParse from "csv-parse/lib/sync";
import fs from 'fs';
const  {Op} = pkg;



export const getAis=async (rawInput)=>{
    const validate = validateWrapper(
        Joi.object({
            port:Joi.number().integer().required(),
            startDate:Joi.date().required(),
            endDate:Joi.date().required(),
            //in km
            distance:Joi.number().required(),
            includeIdleVessels:Joi.boolean().default(false),
        })
    );
    const input = validate(rawInput);

    let  port  = await Models.Port.findByPk(input.port);
    port = port.toJSON();

    const longitude = port.location.coordinates[0];
    const latitude = port.location.coordinates[1];
    const distance = input.distance*1000;
    const where ={
        [Op.and]:Sequelize.where(Sequelize.fn(
            'ST_DWithin',
            Sequelize.col('AIS.location'),
            Sequelize.fn('ST_SetSRID',Sequelize.fn('ST_MakePoint', longitude, latitude),4326),
            distance,
            true
        ),true),
        date:{
            [Op.gte]:input.startDate,
            [Op.lte]:input.endDate,
        },
        type:{
            [Op.gte]:80,
            [Op.lte]:89
        }
    }
    if(!input.includeIdleVessels){
        where.idle=false;
    }
    const aises = await Models.AIS.findAll({
        attributes: {
            include: [
                [
                    Sequelize.fn(
                        'ST_Distance',
                        Sequelize.col('AIS.location'),
                        Sequelize.fn('ST_SetSRID',Sequelize.fn('ST_MakePoint', longitude, latitude),4326),true
                    ),
                    'distance'
                ]
            ]
        },
        include:[Models.Port],
        where,
    });

    return aises;

}
