const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const morgan = require('morgan');
const async = require('async');
const expressHbs = require('express-handlebars');

const app = express();

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(morgan('dev')); //read req made by user    

app.route('/')
    .get((req, res, next) => {
        res.render('main/index');
    })
    .post((req, res, next) => {
        // console.log(req.body.email);
        request({
            url: 'https://us18.api.mailchimp.com/3.0/lists/21e83e90ad/members',
            method: 'POST',
            headers: {
                'Authorization': 'randomUser ad2ec0ec3c37f6c27f8314a0bad35456-us18',
                'Content-Type': 'application/json'
            },
            json: {
                'email_address': req.body.email,
                'status': 'subscribed'
            }
        }, (err, response, body) => {
            if(err) {
                console.log(err);
            } else {
                console.log("sent successfully.. Awesome!");
                res.redirect('/');
            }
        });
    });
    
//http://developer.mailchimp.com/documentation/mailchimp/reference/root/
//---------------------------------------------
//example request
// curl --request GET \
// --url 'https://usX.api.mailchimp.com/3.0/' \ =====> X=18
// --user 'anystring:apikey' \
// --include
//--------------------------
//http://developer.mailchimp.com/documentation/mailchimp/reference/overview/
//------------------------
//add a new list member
///lists/{list_id}/members
//----------------
//list id - 21e83e90ad
//-------------
//api key ad2ec0ec3c37f6c27f8314a0bad35456-us18 //----> 18 
//-----
//url: https://us18.api.mailchimp.com/3.0/lists/21e83e90ad/members
//----
const port = 3000;
app.listen(port, (err) => {
    if(err) console.log(err);
    else console.log(`running on port ${port}`)
});
