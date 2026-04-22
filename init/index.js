import 'dotenv/config';
import mongoose from "mongoose";
import initData from "./data.js";
import Listing from "../models/listing.js";

main().then(()=>{
    console.log("connected to DB");
    initDB();
}).catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "69da7e14c63b73336a16a8d9"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};