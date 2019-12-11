const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table")

// CREATING CONNECTION TO SQL DATABASE
const connection = mysql.createConnection({
   host: "localhost",
   port: 3306,
   user: "root",
   password: "Pma100mill",
   database: "employee_DB"
})

// CONNECT TO THE MYSQL SERVER AND SQL DATABASE
connection.connect(function(err){
   if (err) throw err;
   startApp();
})

