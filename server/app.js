const express = require('express');
const router = require('./routes/authRoutes');
const mongoose = require('mongoose')
const { dbURI, port } = require('./config/config')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { requireAuth, checkCurrentUser } = require('./middelwares/middelwares')
const app = express();

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())
app.use(router);

//connecting to db
mongoose.connect(dbURI)
    .then((result) => {
        app.listen(port, () => console.log(`Listening to port ${port}`))
    })
    .catch((err) => console.log(err));

// app.get('/', (req, res) => {
//     res.status(200).json('Home page')
// })
app.get('/', checkCurrentUser, (req, res) => {
    res.status(200).json({ 'user': res.locals.user })
})
app.get('/smoothies', requireAuth, (req, res) => {
    res.status(200).json({ 'user': res.user })
})