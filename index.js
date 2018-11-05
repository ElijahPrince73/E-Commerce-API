const express = require("express");
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
// Models
//require("./models/Survey");
const PORT = process.env.PORT || 5000

mongoose.connect('mongodb://admin:xTf8jfytaUmHuQE@ds151863.mlab.com:51863/e-commerce-api',
    { useNewUrlParser: true }
).then(() => {
    console.log('connected')
}).catch((err) => {
    console.log(err, 'err')
})

const app = express()

app.use(cors())
app.use(bodyParser.json())
/////////////// ROUTES ////////////////
//require("./routes/authRoutes")(app);
app.listen(PORT, () => {
    console.log('listening on:', PORT)
})