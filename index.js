const express = require('express');
const exphbs = require('express-handlebars');

const pg = require('pg');
const Pool = pg.Pool;
let AvoShopper = require('./avo-shopper');

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

const connectionString =
  process.env.DATABASE_URL || 'postgresql://localhost:5432/avo_shopper';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const avoShopper = AvoShopper(pool);

const app = express();
const PORT = process.env.PORT || 3019;

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.get('/', async function (req, res) {
  //let shop = await avoShopper.dealsForShop(req.body.shopId);

  res.render('index', {});
});

app.get('/avo/list', async function (req, res) {
  let listOfShops = await avoShopper.listShops();
  //console.log(listOfShops);
  res.render('list', { listOfShops });
});

app.get('/avo/add', function (req, res) {
  //console.log(req.body);
  res.render('add', {});
});

app.post('/avo/add', async function (req, res) {
  console.log(req.body);
  let deals = await avoShopper.createDeal(
    req.body.shop,
    req.body.qty,
    req.body.price
  );
  res.render('/', { deals });
});

app.get('/avo/deals', async function (req, res) {
  //console.log(req.body);
  let deals = await avoShopper.recommendDeals(45);
  //console.log(deals);
  res.render('deals', { deals });
});

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function () {
  console.log(`AvoApp started on port ${PORT}`);
});
