// ==========================================
// SIMPLE ATM SIMULATION
// Basic concepts only:
// - Variables (let)
// - Native Loops: for, while, do...while
// - Conditionals: if, else if, else
// - Logical operators: &&, ||, !
// - Console logging: console.log, console.error
// (NO arrays, NO functions, NO objects, NO DOM)
// ==========================================

// --- 1. Variables & Account Setup ---
let balance = 5000;
let correctPin = "041404";
let enteredPin = "041403"; // Starts incorrect to test retry loop

let remainingTrials = 3;
let isLocked = false;
let isAuthenticated = false;

let transactionType = "withdraw"; // Options: "withdraw", "deposit", "savings", "balance"
let amount = 3000;
let withdrawalLimit = 10000;

let dailySavings = 100;
let savingDays = 5;

console.log("======[ ATM SIMULATION ]======\n");

// ==========================================
// LOOP 1: DO...WHILE LOOP (PIN Verification)
// Runs at least once, repeats if PIN is wrong
// ==========================================
do {
    if (enteredPin === correctPin) {
        isAuthenticated = true;
        console.log("PIN accepted! Access granted.\n");
    } else {
        remainingTrials--;
        console.error("Invalid PIN. Try Again.");
        console.log("Remaining Trials: " + remainingTrials + "\n");

        // If no trials left, lock the card
        if (remainingTrials === 0) {
            isLocked = true;
            console.error("Card locked due to 3 failed attempts.");
        } else {
            // User tries again with the right PIN
            enteredPin = "041404";
        }
    }
} while (!isAuthenticated && !isLocked && remainingTrials > 0);

// ==========================================
// CONDITIONALS & LOGICAL OPERATORS
// ==========================================
if (isAuthenticated && !isLocked) {
    console.log("Transaction: " + transactionType);

    // --- CASE 1: WITHDRAW ---
    if (transactionType === "withdraw") {
        if (amount <= 0) {
            console.error("Error: Amount must be greater than 0.");
        } else if (amount > withdrawalLimit) {
            console.error("Error: Exceeded limit of $" + withdrawalLimit);
        } else if (amount > balance) {
            console.error("Error: Insufficient balance!");
        } else {
            balance = balance - amount;
            console.log("Withdrawal of $" + amount + " successful!");
            console.log("New balance: $" + balance);

            // ==========================================
            // LOOP 2: WHILE LOOP (Cash Dispenser)
            // Dispenses $1000 bills until remaining < 1000
            // ==========================================
            console.log("\n--- Dispensing Cash ---");
            let cashToDispense = amount;
            let thousandBills = 0;

            while (cashToDispense >= 1000) {
                cashToDispense = cashToDispense - 1000;
                thousandBills++;
            }

            console.log("Dispensed $1000 bills: " + thousandBills);
            if (cashToDispense > 0) {
                console.log("Dispensed remaining cash: $" + cashToDispense);
            }
        }

    // --- CASE 2: DEPOSIT ---
    } else if (transactionType === "deposit") {
        if (amount <= 0) {
            console.error("Error: Deposit amount must be greater than 0.");
        } else {
            balance = balance + amount;
            console.log("Deposit successful! New balance: $" + balance);
        }

    // --- CASE 3: CHECK BALANCE (uses || logical OR) ---
    } else if (transactionType === "balance" || transactionType === "check") {
        console.log("Your current balance is: $" + balance);

    // --- CASE 4: SAVINGS PLAN ---
    } else if (transactionType === "savings") {
        // ==========================================
        // LOOP 3: STANDARD FOR LOOP (Daily Savings)
        // Simple counter loop: day 1 to savingDays
        // ==========================================
        console.log("\n--- Daily Savings Plan ---");
        for (let day = 1; day <= savingDays; day++) {
            balance = balance + dailySavings;
            console.log("Day " + day + ": Added $" + dailySavings + " | Current Balance: $" + balance);
        }
        console.log("Savings completed! Final balance: $" + balance);

    // --- UNKNOWN OPTION ---
    } else {
        console.error("Invalid transaction type.");
    }

} else {
    console.error("Access Denied: You cannot perform transactions.");
}

console.log("\n======[ TRANSACTION COMPLETE ]======");