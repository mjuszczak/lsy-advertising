/* eslint no-console: 0 */
/* eslint-env node, es6 */

const ADS_RESPONSE = {
    primary_cards: [
          {
              image_url: 'https://images.squarespace-cdn.com/content/v1/5f6918424a397c549c1e62da/1603239219943-5XMWBANW3QZEZA51DZWW/inline-logo-lsy.png?format=1500w',
              redirect_url: 'https://lovestoryyoga.com/'
          }
    ]
}

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 7000;
const baseURL = process.env.BASE_URL || '';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('/', (req, res) => {
    res.send(ADS_RESPONSE);
});

app.listen(port, () => console.log(`App listening on http://localhost:${port}`));
