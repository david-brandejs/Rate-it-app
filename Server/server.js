const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const morgan = require('morgan');

const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');
const Provider = require('./model/providers');
const Review = require('./model/reviews');
const filter = require('content-filter')


require('dotenv').config();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your Heroku app or .env file'
}

var port = process.env.PORT || 3001;

//db config - FIX ON DEPLOYMENT!!!! - to process.env.MONGODB_URI
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('API Request (port 3001): :method :url :status :response-time ms - :res[content-length]'));

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

const checkScopes = jwtAuthz([ 'read:messages' ]);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(filter());

//To prevent errors from Cross Origin Resource Sharing, we will set 
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

//and remove cacheing so we get the most recent items
 res.setHeader('Cache-Control', 'no-cache');
 next();
});

router.get('/', function(req, res) {
 res.json({ message: 'API Initialized!'});
});

// USE AGAINST NOSQL INJECTION
//
//escape() converts the string into ascii code. $ne is converted into %24ne.
//
//var privateKey = escape(req.params.privateKey);
//
//App.findOne({ privateKey: privateKey }, function (err, app) {
//  //do something here
//}


// creates a new IT service provider
router.route('/providers')
.post(checkJwt, checkScopes, function(req, res) {
    var provider = new Provider();
  
    //body parser lets us use the req.body
    provider.name = req.body.name;
    provider.img = req.body.img;
    provider.description = req.body.description;
    provider.info = req.body.info;
    provider.website = req.body.website;
    provider.address = req.body.address;
    provider.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Provider successfully added!' });
    });
});


// skips certain amount of providers based on the pagination and returns 10 providers
router.route('/providers/:skip')
.get(checkJwt, checkScopes, function(req, res) {
    var query = Provider.find().skip(parseInt(escape(req.params.skip)) * 10).limit(10); 
    query.exec(function(err, providers) {
        if (err)
            res.send(err);

        res.json(providers);
    });
});


// skips certain amount of providers based on the pagination and returns 10 providers whose names match a given string
router.route('/providers/:skip/:text')
.get(checkJwt, checkScopes, function(req, res) {
    var query = Provider.find({name: {$regex : req.params.text, $options : 'i' }}).skip(parseInt(escape(req.params.skip)) * 10).limit(10); 
    query.exec(function(err, providers) {
        if (err)
            res.send(err);
      
        res.json(providers);
    });
});


// returns provider names that match a given string
router.route('/providersNames/:text')
.get(checkJwt, checkScopes, function(req, res) {
    Provider.aggregate( [ 
        { $match: { name: {$regex : req.params.text, $options : 'i' } } },
        { $project: { 
                text: "$name" }
        }
    ],
    function(err, review) {
        if (err)
            res.send(err);

        res.json(review);
    });
});


// returns the count of existing providers
router.route('/providersCount')
.get(checkJwt, checkScopes, function(req, res) {
    Provider.count(function(err, providers) {
        if (err)
            res.send(err);
      
        res.json(providers);
    });
});


// returns the count of providers whose names match a given string
router.route('/providersCount/:text')
.get(checkJwt, checkScopes, function(req, res) {
    Provider.aggregate( [ 
        { $match: { name: {$regex : req.params.text, $options : 'i' } } },
        { $group: { _id: null, count: { $sum: 1 } } }
    ],
    function(err, providers) {
        if (err)
            res.send(err);

        res.json(providers);
    });
});


router.route('/provider/:provider_id')
// returns a provider based on his ID
.get(checkJwt, checkScopes, function(req, res) {
    Provider.findById(escape(req.params.provider_id), function(err, provider) {
        if (err)
            res.send(err);
        
        res.json(provider);
    });
})
// updates the providers information
.put(checkJwt, checkScopes, function(req, res) {
    Provider.findById(escape(req.params.provider_id), function(err, provider) {
        if (err)
            res.send(err);

        // if nothing was changed, we will not alter the field
        (req.body.name) ? provider.name = req.body.name : null;
        (req.body.img) ? provider.img = req.body.img : null;
        (req.body.description) ? provider.description = req.body.description : null;
        (req.body.info) ? provider.info = req.body.info : null;
        (req.body.website) ? provider.website = req.body.website : null;
        (req.body.address) ? provider.address = req.body.address : null;
        (req.body.rating) ? provider.rating = req.body.rating : null;
        (req.body.rating === 0) ? provider.rating = req.body.rating : null;
      
        // save provider
        provider.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Provider has been updated' });
        });
    });
});


// returns all reviews that a certain user submitted
router.route('/userReviews/:user_id')
.get(checkJwt, checkScopes, function(req, res) {
    Review.find({user_id: req.params.user_id}, function(err, review) {
        if (err)
            res.send(err);
        
        res.json(review);
    });
});


router.route('/review/:review_id')
// returns a review based on its ID
.get(checkJwt, checkScopes, function(req, res) {
    Review.findById(escape(req.params.review_id), function(err, review) {
        if (err)
            res.send(err);
        
        res.json(review);
    });
})
// updates review information
.put(checkJwt, checkScopes, function(req, res) {
    Review.findById(escape(req.params.review_id), function(err, review) {
        if (err)
            res.send(err);

        // if nothing was changed, we will not alter the field
        (req.body.providerRating) ? review.providerRating = req.body.providerRating : null;
        (req.body.serviceType) ? review.serviceType = req.body.serviceType : null;
        (req.body.serviceRating) ? review.serviceRating = req.body.serviceRating : null;
        (req.body.comment) ? review.comment = req.body.comment : null;
        (req.body.satisfaction) ? review.satisfaction = req.body.satisfaction : null;
      
        // save review
        review.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Review has been updated' });
        });
    });
})
// deletes a review  
.delete(checkJwt, checkScopes, function(req, res) {
    Review.remove({ _id: escape(req.params.review_id) }, function(err, review) {
        if (err)
            res.send(err);
        
        res.json({ message: 'Review has been deleted' });
    });
});


// It is significantly faster to use find() + limit() because findOne() will always read + return the document if it exists. 
router.route('/reviews/:provider_id')
// returns all reviews concerning a certain provider
.get(checkJwt, checkScopes, function(req, res) {
    Review.find({provider_id: escape(req.params.provider_id)}, function(err, review) {
        if (err)
            res.send(err);
        
        res.json(review);
    });
})
// creates a new review concerning a certain provider
.post(checkJwt, checkScopes, function(req, res) {
    var review = new Review();
  
    //body parser lets us use the req.body
    review.user_id = req.body.user_id;
    review.provider_id = req.body.provider_id;
    review.providerRating = req.body.providerRating;
    review.serviceType = req.body.serviceType;
    review.serviceRating = req.body.serviceRating;
    review.comment = req.body.comment;
    review.satisfaction = req.body.satisfaction;
    review.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Review successfully added!' });
    });
});


// calculates and returns the total average of each of the reviews ratings
router.route('/reviews-aggregate/:provider_id')
.get(checkJwt, checkScopes, function(req, res) {
    Review.aggregate( [ 
        { $match: { provider_id: mongoose.Types.ObjectId(escape(req.params.provider_id)) } },
        { $group: { 
                _id: "$provider_id",
                count: { $sum: 1 },
                communication: { $sum: "$providerRating.communication" },
                management: { $sum: "$providerRating.management" },
                integrity: { $sum: "$providerRating.integrity" },
                reliability: { $sum: "$providerRating.reliability" },
                availability: { $sum: "$providerRating.availability" },
                timeliness: { $sum: "$serviceRating.timeliness" },
                quality: { $sum: "$serviceRating.quality" },
                costs: { $sum: "$serviceRating.costs" } 
            }
        },
        { $project: { 
                totalAverage: { $divide: [ { $sum: ["$communication", "$management", "$integrity", "$reliability", 
                    "$availability", "$timeliness", "$quality", "$costs"] }, { $multiply: [8, { $min: "$count" }] } ] } }
        }
    ],
        function(err, review) {
            if (err)
                res.send(err);

            res.json(review);
        });
});

app.use('/api', router);

app.listen(port);
console.log('Server listening on http://localhost:3001. The React app will be built and served at http://localhost:3000.');
