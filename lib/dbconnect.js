// import exp from "constants";
import mongoose from "mongoose";

const connection = async () => {
    try {
        mongoose.connect(process.env.MONGODB)
        console.log('Connection successful');
    } catch (e) {
        console.error(e);
    }
}

export default connection;
