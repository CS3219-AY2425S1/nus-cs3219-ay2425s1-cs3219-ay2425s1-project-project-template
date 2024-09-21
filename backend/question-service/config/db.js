const mongoose = require('mongoose');

const databaseConn = async () => {
    try {
        const user = process.env.MONGODB_USERNAME;
        const password = process.env.MONGODB_PASSWORD;
        const url = process.env.MONGODB_ENDPOINT;        

        DATABASE_URI=`mongodb+srv://${user}:${password}@${url}/?retryWrites=true&w=majority&appName=PeerPrep`
        const conn = await mongoose.connect(DATABASE_URI);
    } catch (err) {
        console.error(err);
    }
}

module.exports = { databaseConn };