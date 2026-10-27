let balance = 100000
let pin = "041404"
let inputPin = "041404"
let withdrawalAmount = 100000
let transaction = "deposit"
let depositAmount = 100000

if (inputPin != pin) {
    console.log("Incorrect PIN! Please try again.")
} else {
    if (transaction == "withdraw".toLowerCase()) {
        if (withdrawalAmount > balance || withdrawalAmount == 0) {
            console.log("Insufficient balance!")
        } else {
            balance -= withdrawalAmount
            console.log("Withdrawal successful! New balance: $" + balance)
        }
    } else if (transaction == "deposit".toLowerCase()) {
        balance += depositAmount
        console.log("Deposit successful! New balance: $" + balance)
    } else if (transaction == "check".toLowerCase() || transaction == "balance".toLowerCase() || transaction == "Check Balance".toLowerCase()) {
        console.log("Your balance is: $" + balance)
    } else {
        console.log("Invalid transaction type.")
    }
}
