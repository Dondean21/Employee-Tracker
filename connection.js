const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table")


const connection = mysql.createConnection({
   host: "localhost",
   port: 3306,
   user: "root",
   password: "Pma100mill",
   database: "employee_db"
})



connection.connect(function(err){
   if (err) throw err;
   startApp();
})

const startApp = () => {
   inquirer
      .prompt({
         name: "action",
         type: "list",
         message: "Welcome to our employee database! What would you like to do?",
         choices: [
               "View all employees",
               "View all departments",
               "View all roles",
               "Add an employee",
               "Add department",
               "Add a role",
               "Update a role",
               "EXIT"
         ]
      }).then(function (answer) {
         switch (answer.action) {
            case "View all employees":
               viewEmployees();
               break;
            case "View all departments":
               viewDepartments();
               break;
            case "View all roles":
               viewRoles();
               break;
            case "Add an employee":
               addEmployee();
               break;
            case "Add department":
               addDepartment();
               break;
            case "Add a role":
               addRole();
               break;
            case "EXIT": 
               endApp();
               break;
            case "Update a role":
               updateRole();
               break;
            default:
               break;
         }
      })
}


const viewEmployees = () => {
   var query = "SELECT * FROM employees";
   connection.query(query, function(err, res) {
      if (err) throw err;
      console.log(res.length + " employees found!");
      console.table('All Employees:', res); 
      startApp();
   })
}



const viewDepartments = () => {
   var query = "SELECT * FROM department";
   connection.query(query, function(err, res) {
      if(err)throw err;
      console.table('All Departments:', res);
      startApp();
   })
}


const viewRoles = () => {
   var query = "SELECT * FROM role";
   connection.query(query, function(err, res){
      if (err) throw err;
      console.table('All roles:', res);
      startApp();
   })
}

const addEmployee = () => {
   connection.query("SELECT * FROM role", function (err, res) {
      if (err) throw err;
      
      inquirer
         .prompt([
            {
               name: "first_name",
               type: "input", 
               message: "Employee's fist name: ",
            },
            {
               name: "last_name",
               type: "input", 
               message: "Employee's last name: "
            },
            {
               name: "role", 
               type: "list",
               choices: function() {
                  var roleArray = [];
                  for (let i = 0; i < res.length; i++) {
                     roleArray.push(res[i].title);
                  }
                  return roleArray;
               },
               message: "What is this employee's role? "
            }
            ]).then(function (answer) {
               let roleID;
               for (let j = 0; j < res.length; j++) {
                  if (res[j].title == answer.role) {
                     roleID = res[j].id;
                     console.log(roleID)
                  }                  
               }  
               connection.query(
                  "INSERT INTO employees SET ?",
                  {
                     first_name: answer.first_name,
                     last_name: answer.last_name,
                     role_id: roleID,
                  },
                  function (err) {
                     if (err) throw err;
                     console.log("Your employee has been added!");
                     startApp();
                  }
               )
            })
   })
}

const addDepartment = () => {
   inquirer
      .prompt([
         {
            name: "new_dept", 
            type: "input", 
            message: "What is the new department you would like to add?"
         }
      ]).then(function (answer) {
         connection.query(
            "INSERT INTO department SET ?",
            {
               name: answer.new_dept
            }
         );
         var query = "SELECT * FROM department";
         connection.query(query, function(err, res) {
         if(err)throw err;
         console.table('All Departments:', res);
         startApp();
         })
      })
}

const addRole = () => {
   connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;

      inquirer 
      .prompt([
         {
            name: "new_role",
            type: "input", 
            message: "What is the Title of the new role?"
         },
         {
            name: "salary",
            type: "input",
            message: "What is the salary of this position? (Enter a number?)"
         },
         {
            name: "deptChoice",
            type: "rawlist",
            choices: function() {
               var deptArry = [];
               for (let i = 0; i < res.length; i++) {
                  deptArry.push(res[i].name);
               }
               return deptArry;
            },
         }
      ]).then(function (answer) {
         let deptID;
         for (let j = 0; j < res.length; j++) {
            if (res[j].name == answer.deptChoice) {
               deptID = res[j].id;
            }
         }

         connection.query(
            "INSERT INTO role SET ?",
            {
               title: answer.new_role,
               salary: answer.salary,
               department_id: deptID
            },
            function (err, res) {
               if(err)throw err;
               console.log("Your new role has been added!");
               startApp();
            }
         )
      })
   })
   
}
function updateRole() {
    connection.query("SELECT * FROM employees", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "employeeName",
                    message: "Please select the employee you want to edit.",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].id + " " + results[i].first_name + " " + results[i].last_name);
                        }
                        return choiceArray;
                    }
                }
            ])
            .then(function (data) {
                for (var i = 0; i < results.length; i++) {
                    if (data.employeeName === results[i].id + " " + results[i].first_name + " " + results[i].last_name) {
                        var employeesID = results[i].id;
                    }
                }
                return (employeesID);
            })
            .then(function (employeesID) {
                inquirer
                    .prompt([
                        {
                            type: "list",
                            name: "chooseEdit",
                            message: "What would you like to edit for this employee?",
                            choices: ['First name', 'Last name', 'Role', 'Manager']
                        }
                    ])
                    .then(function (data) {
                        if (data.chooseEdit === "First name") {
                            newFirstName(employeesID);
                        } else if (data.chooseEdit === "Last name") {
                            newLastName(employeesID);
                        } else if (data.chooseEdit === "Role") {
                            newEmpRole(employeesID);
                        } else {
                            newManager(employeesID);
                        }
                    });
            });
    })
}

const endApp = () => {
   connection.end();
}