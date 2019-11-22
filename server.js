/* eslint no-console: 0 */
/* eslint-env node, es6 */

const bodyParser = require('body-parser');
const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();
const port = process.env.PORT || 7000;
const baseURL = process.env.BASE_URL || '';

// These variables can be safely removed, they are only used for demo purposes.
const colors = {
    default1: '210553',
    default2: '4d509d',
    vip1: 'e43362',
    vip2: 'f199b0'
}
const vipUserIDs = ['456', '789'];

// We use nunjucks for server-side templating, feel free to replace this with your solution.
nunjucks.configure(path.join(__dirname, 'templates'), {
  autoescape: true,
  cache: false,
  express: app
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// This is a helper function for user segmentation in the demo.
function isVipUser(userID) {
    return vipUserIDs.indexOf(userID) != -1;
}

/**
 * This is the home page for the demo app.
 */
app.get('/', (req, res) => {
    const context = {
        exampleURL: `${baseURL}/ad-example`,
    };

    res.render('index.html', context);
});

/**
 * This is an example landing page that users can be redirected to after clicking the ad.
 */
app.get('/landing-page', (req, res) => {
    const userID = req.query.user_id;

    const context = {
        user_id: userID,
        is_targeted_user: isVipUser(userID)
    };

    res.render('landing-page.html', context);
});

/**
 * This is the code that should be modified to implement your own version of the advertising API.
 *
 * In this example:
 *
 * - show how to target known vs. anonymous users
 * - show how to show different ads to different user segments
 * - show how to provide different redirect urls to different user segments
 */
app.post('/ad', (req, res) => {
    const userID = req.body.user_id;

    let user = 'anonymous users';
    if (userID) {
        if (isVipUser(userID)) {
          user = `VIP users`;
        } else {
          user = `default users`;
        }
    }

    let color1 = colors.default1;
    let color2 = colors.default2;
    if (isVipUser(userID)) {
        color1 = colors.vip1;
        color2 = colors.vip2;
    }

    const imageURL1 = `https://via.placeholder.com/1200x628/${color1}/FFFFFF.png?text=${encodeURI(`Ad for ${user}`)}`;
    const imageURL2 = `https://via.placeholder.com/1200x628/${color2}/FFFFFF.png?text=${encodeURI(`Ad for ${user}`)}`;
    let redirectURL = `${baseURL}/landing-page`;

    // By adding the user_id as a query parameter in the redirect url here,
    // you will be able to customize the content that the user sees when they click on your ad in the app.
    // You can add additional query parameters for state management as necessary for your campaign.
    if (req.body.user_id) {
        redirectURL = redirectURL + `?user_id=${req.body.user_id}`
    }

    // This is the response format required by the Mariana Tek platform to serve your ad. Other response data attributes will not be recogonized.
    // NOTE: All urls must be served via https.
    const adResponse = {
        primary_cards: [
            {
                image_url: imageURL1,
                redirect_url: redirectURL
            },
            {
                image_url: imageURL2,
                redirect_url: redirectURL
            }
        ]
    };

    res.send(adResponse);
});

app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`));
