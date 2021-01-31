import database from '../models/database'
import '../models';

database.sync({alter:true}).then(()=>{
    console.log("success");
    process.exit(0)
}).catch(e=>{
    console.error(e);
    process.exit(1);
});

