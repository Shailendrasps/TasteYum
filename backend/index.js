const express = require('express');
const app = express();
const cors = require('cors')
const port = 5000;

const mongoDB = require('./db');
mongoDB();

app.use(cors());
app.use(express.json());
app.use('/api', require("./routes/CreateUser"))
app.use('/api',require('./routes/DisplayData'))
app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(port, () => {
    console.log(`TasteYum app listening on port:${port}`);
})