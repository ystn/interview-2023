const express = require('express');
const app = express();
// const { Expense } = require('@prisma/client');

// parsing the request's json body to javascript object
app.use(express.json());

// handles `/payouts` post request route to calculate payouts for each user
app.post('/payouts', async function(req, res) {
    // const expenses = await Expense.findAll();
    const expenses = req.body.expenses;
    let users = {};
    let userNames = [];
    let totalAmount = 0;
    let numberOfUser = 0;
    
    for(let i of expenses) {
        if(users[i.name] === undefined){
            users[i.name] = i.amount;
            userNames.push(i.name);
            numberOfUser++;
        } else {
            users[i.name] += i.amount;
        }
        totalAmount += i.amount;
    }

    let equalShare = totalAmount / numberOfUser;

    let usersOwed = [];
    let userOws = [];
    let payouts = [];

    for(let name of userNames) {
        let balance = equalShare - users[name];
        if(balance < 0) {
            usersOwed.push({name, balance});
        } else if(balance > 0) {
            userOws.push({name, balance});
        }
    }

    // calculate the payout for every two users
    let owedIndex = 0;
    let owsIndex = 0;
    while(owedIndex < usersOwed.length && owsIndex < userOws.length ) {

        // while(usersOwed[owedIndex].balance > 0) {
            console.log("owed index: ", owedIndex);
            console.log("ows index: ", owsIndex);
            console.log("owed: ", usersOwed)
            console.log("ows: ", userOws)
            let amount = usersOwed[owedIndex].balance + userOws[owsIndex].balance;
            payouts.push({owed: usersOwed[owedIndex].name, owes: userOws[owsIndex].name, amount: amount >= 0 ? -usersOwed[owedIndex].balance : userOws[owsIndex].balance});

            if(amount >= 0) {
                usersOwed[owedIndex].balance += userOws[owsIndex].balance;
                owsIndex++;
            } else {
                userOws[owsIndex].balance += usersOwed[owedIndex].balance;
                owedIndex++;
            }
        // }
    }

    res.json({total: totalAmount, equalShare, payouts});

    
})

app.listen(3000, () => {console.log("Listening on port 3000")});