const express = require('express');
const flash = require('express-flash');
var session = require('express-session');
const exphbs = require('express-handlebars');
let AvoShopper = require('./avo-shopper');

const pg = require('pg');
const Pool = pg.Pool;

// let useSSL = false;
// let local = process.env.LOCAL || false;
// if (process.env.DATABASE_URL && !local) {
//   useSSL = true;
// }

const connectionString = 'postgresql://localhost:5432/avo_shopper';

const pool = new Pool({
  connectionString,
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
});

const avoShopper = AvoShopper(pool);

const app = express();
const PORT = process.env.PORT || 3019;

app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: 'woot',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.get('/', async function (req, res) {
  let deals = await avoShopper.topFiveDeals();
  //console.log(deals);
  res.render('index', { deals });
});

app.get('/avo/list', async function (req, res) {
  let listOfShops = await avoShopper.listShops();
  //console.log(listOfShops);
  if (listOfShops) {
    req.flash('success', 'All shops are added');
  }
  res.render('list', { listOfShops });
});

app.get('/avo/deals', async function (req, res) {
  //console.log(req.body);
  let shopDeals = await avoShopper.recommendDeals(45);
  //console.log(shopDeals);
  res.render('deals', { shopDeals });
});

app.get('/avo/add', function (req, res) {
  res.render('add', {});
});

app.get('/avo/newshop', function (req, res) {
  res.render('newShop', {});
});

app.post('/avo/newshop', async function (req, res) {
  //console.log(req.body);
  let addNewShop = await avoShopper.createShop(req.body.shop);

  //console.log(addNewShop);
  if (!shop) {
    req.flash('error', 'Please fill in the field!');
  }
  res.render('index', { addNewShop });
});

app.get('/avo/add', function (req, res) {
  res.render('add', {});
});

app.post('/avo/add', async function (req, res) {
  // console.log(req.body);
  let newDeals = await avoShopper.createDeal(
    req.body.shop,
    req.body.qty,
    req.body.price
  );
  if (!newDeals) {
    req.flash('error', 'Please fill in all details');
  }
  res.render('index', { newDeals });
});

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function () {
  console.log(`AvoApp started on port ${PORT}`);
});
