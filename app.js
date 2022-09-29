
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

