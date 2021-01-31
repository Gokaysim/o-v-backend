import sequelize from "./database";
import pkg from "sequelize";
const { Model, DataTypes } = pkg;

class Port extends Model {}

Port.init({
    //For simplicity another table is not created
    countryCode:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    countryName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    portName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    portNameNormalized:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:"",
    },
    facilityName:{
        type:DataTypes.TEXT,
    },
    imoPortFacilityNumber:{
        type:DataTypes.STRING,
        allowNull: false
    },
    description:{
        type:DataTypes.TEXT,
    },
    location: {
        type: DataTypes.GEOMETRY("POINT", 4326),
        allowNull: false,
    },
    planApproved:{
        type:DataTypes.BOOLEAN,
        allowNull: true
    },
    initialApprovedDate: {
        type:DataTypes.DATE,
    },
    reviewDate:{
        type:DataTypes.DATE,
    },
    socIssueDate:{
        type:DataTypes.DATE
    },
    securityPlanWithdrawn:{
        type:DataTypes.BOOLEAN,
        allowNull:true
    },
    withDrawnDate:{
        type:DataTypes.DATE,
        allowNull: true
    },
    lastUpdated:{
        type:DataTypes.DATE,
    }
},{
    sequelize,
    indexes:[{
        unique: false,
        fields: ["portNameNormalized"],
    }],
    modelName: "Port",
});

Port.addHook("beforeSave", (port, options) => {
    console.log('asdasd')
    if(port.portName){
        port.portNameNormalized =
             port.portName.toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
    }

});
export default Port;
