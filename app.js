
var plugin = function (options) {
    var seneca = this;

    seneca.add({ role: 'user', cmd: 'post' }, function (msg, respond) {
        this.make('user').data$(msg.data).save$(respond);
    });

    seneca.add({ role: 'user', cmd: 'get' }, function (msg, respond) {
        this.make('user').load$(msg.data.user_id, respond);
    });

    seneca.add({ role: 'user', cmd: 'get-all' }, function (msg, respond) {
        this.make('user').list$({}, respond);
    });

    seneca.add({ role: 'user', cmd: 'delete' }, function (msg, respond) {
        this.make('user').remove$(msg.data, respond);
    });


}

module.exports = plugin;



var seneca = require("seneca")();
seneca.use(plugin);
seneca.use('seneca-entity');

seneca.add('role:api, cmd:add-user', function (args, done) {
    var user = {
        Username: args.username,
        Email: args.email,
        Age: args.age
    }
    seneca.act({ role: 'user', cmd: 'post', data: user }, function (err, msg) {
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-all-users', function (args, done) {
    seneca.act({ role: 'user', cmd: 'get-all' }, function (err, msg) {
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-user', function (args, done) {
    seneca.act({ role: 'user', cmd: 'get', data: { user_id: args.user_id } }, function (err, msg) {
        done(err, msg);
    });
});


seneca.add('role:api, cmd:delete-user', function (args, done) {
    seneca.act({ role: 'user', cmd: 'delete' }, function (err, msg) {
        done(err, msg);
    });
});

seneca.add('role:api, cmd:delete-all-users', function (args, done) {
    done(null, { cmd: "delete-all-users" });
});

seneca.act('role:web', {
    use: {
        prefix: '/api',
        pin: { role: 'api', cmd: '*' },
        map: {
            'add-user': {POST: true ,GET: true },
            'get-all-users': { GET: true },
            'get-user': { GET: true, },
            'delete-user': { GET: true, }
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
    if(req.method === "POST") countPOST++;
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
console.log("http://127.0.0.1:3009/api/add-user?username=Krisuv&email=krisuv16@gmail.con&age=21");
console.log("http://127.0.0.1:3009/api/get-all-users");
console.log("http://127.0.0.1:3009/api/get-user?user_id=id");
console.log("http://127.0.0.1:3009/api/delete-user");
