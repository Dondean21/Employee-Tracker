INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Leader", 120000, 1), /* 1 */
         ("Sales", 80000, 1), /* 2 */
         ("Engineer", 160000, 2), /* 3 */
         ("Accountant", 190000, 3), /* 4 */
         ("Software Engineer", 180000, 2), /* 5 */
         ("Legal", 150000, 4), /* 6 */
         ("Lawyer", 120000, 4); /* 7 */

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Mark", "Normand", 3, null), 
         ("Dan", "Soder", 1, null),
         ("Jay", "Oakerson", 6, null),
         ("Luis", "Gomez", 4, null),
         ("Tom", "Segura", 2, null),
         ("Tony", "Hinchcliffe", 7, null), 
         ("Shane", "Gillis", 5, null); 