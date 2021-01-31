import Sequelize from "sequelize";
// postgresql://localhost:5432/postgres

const sequelize = new Sequelize(
    "postgres://rzfbzevtmnstzy:05fc04565a3bf3cd4f4514e4d7ee3a5651d656e41213162fd6af5f16dc24bcf9@ec2-18-203-62-227.eu-west-1.compute.amazonaws.com:5432/dd4hj12ketejc2",
    {
        // disable logging; default: console.lo
        dialect: 'postgres',
        logging: true,
        native: {
            native: true,
            ssl: true
        }
    }
);

export default sequelize;
