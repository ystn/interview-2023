const express = require('express');
const app = express();

// parsing the request's json body to javascript object
app.use(express.json());

// handles `/payouts` post request route to calculate payouts for each user
app.post('/payouts', async function(req, res) {
    // gets the expenses from the body of the request
    const expenses = req.body.expenses;

    // the `users` object will contain the total amount paid by every user
    let users = {};

    // the `userNames` will contain a list of the names of the users
    let userNames = [];

    // the `totalAmount` is the total amount been paid
    let totalAmount = 0;

    // the `numberOfUser` is the total number of users
    let numberOfUser = 0;
    
    // go throughout all the expenses
    for(let i of expenses) {
        if(users[i.name] === undefined){
            // adds the user to the `users` object
            users[i.name] = i.amount;
            userNames.push(i.name);
            numberOfUser++;
        } else {
            // updates the user by adding the amount
            users[i.name] += i.amount;
        }
        // adding the amount to get the total
        totalAmount += i.amount;
    }

    // calculates the part of every user
    let equalShare = totalAmount / numberOfUser;

    // `usersOwed` is a list of owed users
    let usersOwed = [];

    // `userOws` is a list of owes users
    let userOws = [];

    // `payouts` is the list of payouts
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
    let owedIndex = 0; // stores the last owed index visited
    let owsIndex = 0; // stores the last owes index visited

    // the loop to 
    while(owedIndex < usersOwed.length && owsIndex < userOws.length ) {

        // while(usersOwed[owedIndex].balance > 0) {
            console.log("owed index: ", owedIndex);
            console.log("ows index: ", owsIndex);
            console.log("owed: ", usersOwed)
            console.log("ows: ", userOws)

            // calculates the amount that the owed user will have after he pays to the owes user
            let amount = usersOwed[owedIndex].balance + userOws[owsIndex].balance;

            // 
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