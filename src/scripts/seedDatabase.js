import fs from 'fs';
import Models from '../models';
import AIS from "../models/AIS";
import csvParse from "csv-parse/lib/sync";
import moment from 'moment';


const seedPorts = async ()=>{
    const rawCsv = await fs.promises.readFile('./ports.csv','utf8');
    const records = csvParse(rawCsv, {
        columns: true,
        skip_empty_lines: true
    })

    const list =[]
    for(let i=0;i<records.length;i++) {
        const record = records[i];

        let longitude = record.Longitude;
        longitude = Number(longitude.substring(0,longitude.length-1)) * (longitude[longitude.length-1]==="E"?1:1)/10000;

        let latitude = record.Latitude;
        latitude = Number(latitude.substring(0,latitude.length-1)) * (latitude[latitude.length-1]==="N"?1:1)/10000;

        const createObject = {
            countryCode:record["Country Code"],
            countryName:record["Country Name"],
            portName:record["Port Name"],
            portNameNormalized:record["Port Name"]
                .toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, ""),
            facilityName:record["Facility Name"],
            imoPortFacilityNumber:record["IMO Port Facility Number"],
            description:record.Description,
            location:{ type: "Point", coordinates: [longitude,latitude],crs: {
                    type: "name",
                    properties: {
                        name: "urn:ogc:def:crs:EPSG::4326"
                    }
                }},
            planApproved:record["Plan Approved?"],
            initialApprovedDate:record["Initial Approval Date"]?moment(record["Initial Approval Date"],"DD/MM/YYYY HH:mm").format():null,
            reviewDate:record["Review Date"]?moment(record["Review Date"],"DD/MM/YYYY HH:mm").format():null,
            socIssueDate:record["SoC Issue Date"]?moment(record["SoC Issue Date"],"DD/MM/YYYY HH:mm").format():null,
            securityPlanWithdrawn:record["Security Plan Withdrawn?"],
            withDrawnDate:record["Withdrawn Date"]?moment(record["Withdrawn Date"],"DD/MM/YYYY HH:mm").format():null,
            lastUpdated:record["Last Updated"]?moment(record["Last Updated"],"DD/MM/YYYY HH:mm").format():null,
        }
        list.push(createObject);
        // await Models.Port.create(createObject)
    }
    await Models.Port.bulkCreate(list);
}


const getPortId = (dest,ports)=>{

    if(dest){
        if(dest.length === 5){
            const port = ports.find(item=>item.imoPortFacilityNumber && item.imoPortFacilityNumber.startsWith(dest) )
            if(port){
                return port.id;
            }
        }

        if(dest.includes(">>")){
            const subDest = dest.split(">>")[1]
            const portId = getPortId(subDest,ports);
            if(portId){
                return portId;
            }
        }
        if(dest.includes(">")){
            const subDest = dest.split(">")[1]
            const portId = getPortId(subDest,ports);
            if(portId){
                return portId;
            }
        }
        if(dest.replace(" ","").length ===5){
            const port = ports.find(item=>item.imoPortFacilityNumber && item.imoPortFacilityNumber.startsWith(dest.replace(" ","")) )
            if(port){
                return port.id;
            }
        }
        const portFromName = ports.find(item=>item.portName.toLowerCase().includes(dest.toLowerCase()));
        if(portFromName){
            return portFromName.id;
        }
        const portFromFacilityName = ports.find(item=>item.facilityName.toLowerCase().includes(dest.toLowerCase()));
        if(portFromFacilityName){
            return portFromFacilityName.id;
        }
    }
    // if(dest){
    //     console.log("unknown dest:",dest);
    // }
    return null;
}
const seedAIS = async ()=>{

    const ports = await Models.Port.findAll();
    const entriesJson = await fs.promises.readFile('./data.json','utf8');
    const entries = JSON.parse(entriesJson);

    const list =[];
    for(let i =0;i<entries.length;i++) {
        const entry = entries[i];
        const portId = getPortId(entry.DEST,ports);
        console.log(portId);
        const createObject ={
            MMSI:entry.MMSI,
            lastData:true,
            date:entry.TIME,
            location: { type: "Point", coordinates: [entry.LONGITUDE,entry.LATITUDE],crs: {
                    type: "name",
                    properties: {
                        name: "urn:ogc:def:crs:EPSG::4326"
                    }
                }
            },
            courseOverGround:entry.COG,
            speedOverGround:entry.SOG,
            heading:entry.HEADING,
            positionAccuracy:entry.PAC,
            rateOfTurn:entry.ROT,
            navStat:entry.NAVSTAT,
            IMO:entry.IMO,
            name:entry.NAME,
            callSign:entry.CALLSIGN,
            type:entry.TYPE,
            a:entry.A,
            b:entry.B,
            c:entry.C,
            d:entry.D,
            draught:entry.DRAUGHT,
            dest:entry.DEST,
            ETA:entry.ETA,
            PortId:portId,
            idle:!entry.DEST||entry.ETA==="00:00 00:00"

        }
        list.push(createObject);
    }
    console.log("all ais read")
    await Models.AIS.bulkCreate(list)
}

const seedDatabase = async () => {
    // await seedPorts()
    await seedAIS();
}

seedDatabase();
