const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    // database: "lc-wm-database",
    database: "unified-reports",

});

db.connect((err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to MySQL");
});

module.exports = db;
