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



function updateRole(){
   let employees = [];
   let queryString = "SELECT * FROM role r, employees e WHERE r.id = e.role_id";
   connection.query(queryString, function(err, res) {
     if (err) throw err;
     for (let i = 0; i < res.length; i++) {
       employees.push(res[i].first_name + " " + res[i].last_name);
     }
     if (employees.length == 0) {
       console.log("\nNo Employees Stored In The Database\n");
       setTimeout(function(){addEmployee();}, 1000);
     }else{
     let role = [];
     let queryString = "SELECT r.id AS roleId, r.title FROM role r";
     connection.query(queryString, function(err, res) {
       for (i = 0; i < res.length; i++) {
         role.push(res[i].title);}
       if (err) throw err;});
       inquirer.prompt([
         {name: "employeeName",
         type: "list",
         message: "Choose Employee to Edit",
         choices: employees
       },
         {
           name: "roleChoice",
           type: "list",
           message: `Choose New Role`,
           choices: role
         }
       ])
       .then(function(data) {
         let newRole;
         for(i = 0; i < role.length; i++){
           if(role[i] === data.roleChoice){
             newRole = i + 1;
           }
         }
         let updateNameArr = data.employeeName.split(" ");
         let first = updateNameArr[0];
         let last = updateNameArr[1];
         let employee = [{role_id: newRole},{first_name: first},{last_name: last}]
         let query = "UPDATE employees SET ? WHERE ? AND ?";
         connection.query(query, employee,
           function(err, res) {
             if (err) throw err;
             console.log(`\n${first} ${last}'s Role Updated To ${data.roleChoice}\n`);
             startApp();
           }
         );
       });}
   });
 }


const endApp = () => {
   connection.end();
}