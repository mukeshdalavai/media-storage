const express = require('express');
const env = require('dotenv');
const cors = require('cors');
const service = require('./service');
const app = express();

env.config();
app.use(express.json());
app.use(cors());


app.use('/',service.router);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on port ${port} ...`));
