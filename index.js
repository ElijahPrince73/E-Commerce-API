const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const formidableMiddleware = require('express-formidable');
require('dotenv').config({ path: './.env.default' });

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const PORT = process.env.PORT || 5000;

// Models
require('./models/User');

const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL, { useNewUrlParser: true });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(formidableMiddleware());

// ///////////// USER ROUTES //////////////////
require('./routes/user-routes/auth')(app);
require('./routes/user-routes/cart')(app);

// ///////////// ADMIN ROUTES /////////////////
require('./routes/admin-routes/auth')(app);
require('./routes/admin-routes/images')(app);

// ///////////// SHARED ROUTES ////////////////
require('./routes/category')(app);
require('./routes/products')(app);
require('./routes/product-category')(app);

// ///////////// BILLING ROUTES ////////////////
require('./routes/billing')(app);

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
