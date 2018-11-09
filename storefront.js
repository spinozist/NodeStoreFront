var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "storefront_db"
});

connection.connect(function (err) {
    if (err) throw err;
    role();
});


function showInventory() {
    console.log(`\n***THIS IS WHAT WE'VE GOT***`)
    console.log(`id || item || price || stock`)
    var query = "SELECT * FROM inventory";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(` ${res[i].id} // ${res[i].name} // ${res[i].price} // ${res[i].in_stock}`);
        }
        if (res) {
            enterStore();
        }
    });
};

function role() {
    inquirer
        .prompt(
            {
                name: "role",
                type: "list",
                message: "Who are you?",
                choices: [
                    "Customer",
                    "Admin"
                ]
            }
        )
        .then(function (answer) {
            switch (answer.role) {
                case "Customer":
                    showInventory();
                    break;

                case "Admin":
                    passWord();
                    break;
            }
        })
}

function enterStore() {

    inquirer
        .prompt(
            {
                name: "buy",
                type: "list",
                message: "Wanna buy something?",
                choices: [
                    "Yes",
                    "No"
                ]
            }
        )
        .then(function (answer) {
            if (answer.buy === "Yes") {
                inquirer
                    .prompt([
                        {
                            name: "itemID",
                            type: "input",
                            message: "Item ID?",
                        },
                        {
                            name: "itemQuantity",
                            type: "input",
                            message: "How many?",
                        }
                    ])
                    .then(function (answer) {
                        console.log(`\nYou'd like ${answer.itemQuantity} of item ${answer.itemID}`);
                        buyItem(answer.itemID, answer.itemQuantity);
                    })
            } else {
                restartPrompt();
            }
        })
};

function buyItem(itemID, amount) {

    connection.query(
        `SELECT in_stock, id FROM inventory WHERE id=${itemID};`,
        function (error, res) {
            if (error) throw err;
            if (amount > res.in_stock) {
                console.log(`We don't enough in stock. Please try another selection.`);
                enterStore();
            } else {
                connection.query(
                    `UPDATE inventory SET in_stock = in_stock - ${amount} WHERE id=${itemID};`,
                    function (error) {
                        if (error) throw err;
                        if (amount > 1) {
                            console.log('\nItems purchased successfully!');
                        } else {
                            console.log('\nItem purchased successfully!');
                        }
                        logPurchases(itemID, amount)
                        showInventory();
                    }
                )
            }

        }
    );
}

function logPurchases(itemID, amount) {
    connection.query(
        `INSERT INTO sales (item_id,quantity) VALUES (${itemID},${amount});`,
        function () {
            // if (error) throw err;
            // console.log(`Sale logged`);
        }
    )
}

function passWord() {
    inquirer
        .prompt(
            {
                name: "password",
                type: "input",
                messages: "Enter password"
            }
        ).
        then(function (answer) {
            if (answer.password === "r2d2") {
                showSales();
            } else {
                console.log(`Accessed denied!`);
                restartPrompt();
            }
        })
}


function restartPrompt() {
    inquirer
        .prompt({
            name: "restart",
            type: "list",
            message: "Restart?",
            choices: [
                "Yes",
                "No"
            ]
        })
        .then(function (answer) {
            if (answer.restart === "Yes") {
                role();
            } else {
                console.log(`Press ^C to Exit.`);
            }
        })
}

function showSales() {
    console.log(`\n******SALES******`);
    console.log(`id // item // #`);
    var query = `
    SELECT item_id, id, quantity, name, price, department 
    FROM sales 
    LEFT JOIN inventory ON sales.item_id = inventory.id;
    `;
    connection.query(query, function (err, res) {

        for (var i = 0; i < res.length; i++) {
            console.log(`${res[i].item_id} // ${res[i].department} // ${res[i].name} // ${res[i].quantity} @ ${res[i].price} = $${res[i].quantity * res[i].price}`);
        }

        departmentSales();
    });
};

function departmentSales() {
    inquirer
        .prompt({
            name: "departmentSales",
            type: "list",
            message: "Wanna see department totals?",
            choices: [
                "Yes",
                "No"
            ]
        })
        .then(function (answer) {
            if (answer.departmentSales === "Yes") {
                console.log(`\nUNDER CONSTRUCTION`);
                restartPrompt();

                // console.log(`  DEPARTMENT SALES**`);
                // console.log(`  Dept || Total Sales`)

                // var query = `
                // SELECT department, sum(price), item_id, id 
                // FROM sales 
                // LEFT JOIN inventory ON sales.item_id = inventory.id
                // GROUP BY department;
                // `;
                // connection.query(query, function (err, res) {
                //     for (var i = 0; i < res.length; i++) {
                //         console.log(`${res[i].department} // ${res[i].sum(price)}`);
                //     }
                //     restartPrompt();
                //     //Function to show department totals
                // })
            } else {
                restartPrompt();
            }
        })
}

// function departmentLog(department, saleTotal) {
//     connection.query(
//         `INSERT INTO department (department,saleTotal) VALUES (${department},${saleTotal});`,
//         function () {
//             // if (error) throw err;
//             // console.log(`Sale logged`);
//         }
//     )
// }