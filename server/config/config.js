require('dotenv').config({ path: './config/.env' });

module.exports = {
    port: process.env.PORT,
    dbURI: process.env.DBURI,
    jwt_secret: process.env.JWT_SECRET,
}