import mongoose from "mongoose";
import initData from "./data.js";
import Listing from "../models/listing.js";

main().then(()=>{
    console.log("connected to DB");
    initDB();
}).catch(()=>{
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "69da7e14c63b73336a16a8d9"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};