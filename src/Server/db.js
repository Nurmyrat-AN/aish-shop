var mysql = require('mysql');
var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'NuR123nUr!@#',

    database: 'aish_shop',
    charset : 'utf8',

    multipleStatements: true
});
db.connect(function (err) {
    if (err)
        throw err;
});
module.exports = db;