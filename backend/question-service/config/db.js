const mongoose = require('mongoose');

const databaseConn = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URI);
    } catch (err) {
        console.error(err);
    }
}



module.exports = { databaseConn };