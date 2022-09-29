
var plugin = function (options) {
    var seneca = this;

    seneca.add({ role: 'products', cmd: 'post' }, function (msg, respond) {
        this.make('products').data$(msg.data).save$(respond);
    });

    seneca.add({ role: 'products', cmd: 'get' }, function (msg, respond) {
        this.make('products').load$(msg.data.products_id, respond);
    });

    seneca.add({ role: 'products', cmd: 'get-all' }, function (msg, respond) {
        this.make('products').list$({}, respond);
    });

    seneca.add({ role: 'products', cmd: 'delete' }, function (msg, respond) {
        this.make('products').remove$(msg.data, respond);
    });


}

module.exports = plugin;



var seneca = require("seneca")();
seneca.use(plugin);
seneca.use('seneca-entity');

seneca.add('role:api, cmd:add-products', function (args, done) {
    var products = {
        Product: args.productsname,
        Type: args.type,
        Quantity: args.quantity
    }
    seneca.act({ role: 'products', cmd: 'post', data: products, }, function (err, msg) {
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-all-productss', function (args, done) {
    seneca.act({ role: 'products', cmd: 'get-all' }, function (err, msg) {
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-products', function (args, done) {
    seneca.act({ role: 'products', cmd: 'get', data: { products_id: args.products_id } }, function (err, msg) {
        done(err, msg);
    });
});


seneca.add('role:api, cmd:delete-products', function (args, done) {
    seneca.act({ role: 'products', cmd: 'delete' }, function (err, msg) {
        done(err, msg);
    });
});

seneca.add('role:api, cmd:delete-all-productss', function (args, done) {
    done(null, { cmd: "delete-all-productss" });
});

seneca.act('role:web', {
    use: {
        prefix: '/api',
        pin: { role: 'api', cmd: '*' },
        map: {
            'add-products': {POST: true ,GET: true },
            'get-all-productss': { GET: true },
            'get-products': { GET: true, },
            'delete-products': { GET: true, }
        }
    }
})

let countGET = 0;
let countPOST = 0;

function countMiddleware(req, res, next) {
    console.log("sadddddddd");
    console.log(req.method);
    console.log("sadddddddd");
    if(req.method === "GET") countGET++;
    if(req.method === "ADD") countPOST++;
    console.log("Request Count ==> Get:" + countGET + ", Post:" + countPOST + " <== Request Count")
    if(next)next();
}

var express = require('express');
var app = express();
app.use(require("body-parser").json())
app.use(countMiddleware)
app.use(seneca.export('web'));



app.listen(3009)
console.log("Server listening on 127.0.0.1:3009 ...");
console.log("----- Requests -------------------------");
console.log("http://127.0.0.1:3009/api/add-products?productsname=Krisuv&type=Nice&quantity=21");
console.log("http://127.0.0.1:3009/api/get-all-productss");
console.log("http://127.0.0.1:3009/api/get-products?products_id=id");
console.log("http://127.0.0.1:3009/api/delete-products");
