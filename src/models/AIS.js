import sequelize from "./database";
import pkg from "sequelize";
import Port from './Port';
const { Model, DataTypes } = pkg;

class AIS extends Model {}

AIS.init(
    {
        //Ship id
        MMSI:{
            type:DataTypes.STRING,
            allowNull:false
        },
        //indicates it is last location of IMO
        lastData:{
          type:DataTypes.BOOLEAN,
            defaultValue:true,
            allowNull: false
        },
        date:{
            type:DataTypes.DATE,
            allowNull: false
        },
        location: {
            type: DataTypes.GEOMETRY("POINT", 4326),
            allowNull: false,
        },
        courseOverGround:{
            type:DataTypes.DOUBLE,
            allowNull:true
        },
        speedOverGround:{
            type:DataTypes.DOUBLE,
            allowNull:true
        },
        heading:{
            type:DataTypes.INTEGER,
            allowNull: true
        },
        positionAccuracy:{
            type:DataTypes.BOOLEAN,
            allowNull: true
        },
        rateOfTurn:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        navStat:{
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        IMO:{
            type:DataTypes.INTEGER,
            allowNull: false
        },
        name:{
            type:DataTypes.STRING,
        },
        callSign:{
            type:DataTypes.STRING,
        },
        type:{
            type:DataTypes.INTEGER,
        },
        a:{
            type:DataTypes.INTEGER,
        },
        b:{
            type:DataTypes.INTEGER,
        },
        c:{
            type:DataTypes.INTEGER,
        },
        d:{
            type:DataTypes.INTEGER,
        },
        draught:{
            type:DataTypes.DOUBLE
        },
        dest:{
            type:DataTypes.STRING,
        },
        ETA:{
            type:DataTypes.STRING,
        },
        idle:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
            allowNull:false
        }

    },
    {
        sequelize,
        modelName: "AIS",
        indexes:[{
            unique: false,
            fields: ["MMSI"],
        },{
            unique: false,
            fields: ["lastData"],
        },{
            unique: false,
            fields: ["date"],
        },{
            unique: false,
            fields: ["location"],
        },{
            unique: false,
            fields: ["IMO"],
        },{
            unique: false,
            fields: ["idle"],
        },{
            unique: false,
            fields: ["type"],
        }]
    }
);

AIS.belongsTo(Port,{
    foreignKey:{
        allowNull:true
    }
});

Port.hasMany(AIS)


export default AIS;
