const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

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

// ///////////// USER ROUTES //////////////////
require('./routes/user-routes/auth')(app);
require('./routes/user-routes/cart')(app);

// ///////////// ADMIN ROUTES /////////////////
require('./routes/admin-routes/auth')(app);
require('./routes/admin-routes/images')(app);
require('./routes/admin-routes/products')(app);
require('./routes/admin-routes/category')(app);
require('./routes/admin-routes/product-category')(app);

// ///////////// SHARED ROUTES ////////////////
require('./routes/shared-routes/category')(app);
require('./routes/shared-routes/products')(app);
require('./routes/shared-routes/billing')(app);
require('./routes/shared-routes/forgot-password')(app);

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
