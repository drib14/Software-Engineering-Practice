// =============================================================================
// PERSONAL BANKING SYSTEM (CLI) - JAVASCRIPT ZERO-TO-FUNCTION CHALLENGE
// Console only | No arrays | No objects | Basic primitives & functions only
// =============================================================================

// --- Module 1: State Variables ---
const accountHolder = "Alex Morgan";
let balance = 1000;
let pin = "1234";
let isAccountActive = true;
let isAccountLocked = false;
let successfulTransactions = 0;
let failedTransactions = 0;

// [1] IIFE: Run initial account setup immediately
(function () {
    if (balance < 0) {
        console.error("Setup Error: Initial balance cannot be negative.");
        isAccountActive = false;
    } else {
        console.log(`Account initialized for ${accountHolder.trim()}. Initial Balance: $${balance}`);
    }
})();

// [2] Function Hoisting: Calling function declaration before its definition
displayBanner();

function displayBanner() {
    console.log("==========================================");
    console.log("       PERSONAL BANKING SYSTEM CLI        ");
    console.log("==========================================\n");
}

// [3] Async Function: Simulate asynchronous account verification task
async function verifyAccountAsync(holderName) {
    console.log(`[ASYNC] Verifying account credentials for ${holderName}...`);
    await Promise.resolve(); // Simulating async completion
    console.log("[ASYNC] Background verification passed: Account Active.\n");
    return true;
}

// [4] Function Declaration: Authenticate the user
function authenticate(enteredPin, targetPin) {
    return enteredPin === targetPin;
}

// [5] Anonymous Function: Validate transaction amount
const validateAmount = function (amount) {
    return amount > 0;
};

// [6] Function Expression: Calculate a deposit
const calculateDeposit = function (currentBalance, depositAmount) {
    return currentBalance + depositAmount;
};

// [7] Arrow Function: Check whether a withdrawal is allowed
const isWithdrawalAllowed = (amount, currentBalance) => amount > 0 && amount <= currentBalance;

// [8] Function with a Return Value: Calculate updated balance using ternary operator
function calculateUpdatedBalance(currentBalance, amount, isDeposit) {
    return isDeposit ? currentBalance + amount : currentBalance - amount;
}

// [9] Generator Function: Generate a sequence of transaction IDs using yield
function* transactionIdGenerator() {
    let id = 1001;
    while (true) {
        yield `TXN-${id}`;
        id++;
    }
}
const txnIds = transactionIdGenerator();

// [10] Closure: Private transaction counter that persists across calls
function createTransactionCounter() {
    let privateCounter = 0;
    return function () {
        privateCounter++;
        return privateCounter;
    };
}
const getTransactionCount = createTransactionCounter();

// [11] Function with Default Parameters & [12] Nested Function: Display summary
function displaySummary(message = "Standard Account Summary") {
    // Nested helper function for formatting
    function formatCurrency(num) {
        return `$${num.toFixed(2)}`;
    }

    console.log(`\n--- ${message} ---`);
    console.log(`Account Holder : ${accountHolder.toUpperCase()}`);
    console.log(`Account Status : ${isAccountActive ? (isAccountLocked ? "LOCKED" : "ACTIVE") : "INACTIVE"}`);
    console.log(`Current Balance: ${formatCurrency(balance)}`);
    console.log(`Transactions   : ${successfulTransactions} Succeeded | ${failedTransactions} Failed`);
    console.log("------------------------------------------\n");
}

// [13] Callback Function: Handles transaction result output
function handleTransactionResult(isSuccess, message) {
    if (isSuccess) {
        successfulTransactions++;
        console.log(`>> SUCCESS: ${message}`);
    } else {
        failedTransactions++;
        console.error(`>> FAILED: ${message}`);
    }
}

// [14] Higher-Order Function with Parameters: Accepts callback as argument
function processTransaction(type, amount, callback) {
    if (isAccountLocked || !isAccountActive) {
        callback(false, "Transaction denied. Account is inactive or locked.");
        return;
    }

    const txnId = txnIds.next().value;
    const count = getTransactionCount();

    if (type === "deposit") {
        if (!validateAmount(amount)) {
            callback(false, `[${txnId} #${count}] Deposit rejected. Amount must be greater than zero.`);
            return;
        }
        balance = calculateDeposit(balance, amount);
        callback(true, `[${txnId} #${count}] Deposited $${amount}. New balance: $${balance}`);
    } else if (type === "withdraw") {
        if (!validateAmount(amount)) {
            callback(false, `[${txnId} #${count}] Withdrawal rejected. Amount must be greater than zero.`);
            return;
        }
        if (!isWithdrawalAllowed(amount, balance)) {
            callback(false, `[${txnId} #${count}] Insufficient funds! Requested $${amount}, Available: $${balance}`);
            return;
        }
        balance = calculateUpdatedBalance(balance, amount, false);
        callback(true, `[${txnId} #${count}] Withdrew $${amount}. New balance: $${balance}`);
    } else if (type === "balance") {
        callback(true, `[${txnId} #${count}] Current balance is $${balance}`);
    } else {
        callback(false, `[${txnId} #${count}] Invalid transaction type: "${type}"`);
    }
}

// [15] Function with Rest Parameters: Accept variable amounts without storing in array
function calculateBatchTotal(...amounts) {
    let total = 0;
    for (let amt of amounts) {
        total += amt;
    }
    return total;
}

// =============================================================================
// APPLICATION EXECUTION (Loops, Conditionals, Menu Flow)
// =============================================================================
async function runBankingSystem() {
    // Run async verification
    await verifyAccountAsync(accountHolder);

    // Initial account summary
    displaySummary();

    // --- Module 2: Authentication using DO...WHILE Loop ---
    let maxAttempts = 3;
    let attempts = 0;
    let isAuthenticated = false;
    let inputPin = "9999"; // Starts with incorrect PIN to demonstrate retry logic

    console.log("--- Authentication ---");
    do {
        attempts++;
        console.log(`Entering PIN: "${inputPin}" (Attempt ${attempts} of ${maxAttempts})`);

        if (authenticate(inputPin, pin)) {
            isAuthenticated = true;
            console.log(">> Access granted!\n");
        } else {
            console.error(">> Incorrect PIN.");
            if (attempts >= maxAttempts) {
                isAccountLocked = true;
                console.error(">> [CRITICAL] 3 failed attempts. Account locked!\n");
            } else {
                // User enters correct PIN on next attempt
                inputPin = "1234";
            }
        }
    } while (!isAuthenticated && !isAccountLocked && attempts < maxAttempts);

    // --- Module 3 & 4: Transaction Menu using WHILE Loop with BREAK and CONTINUE ---
    if (isAuthenticated && !isAccountLocked) {
        console.log("--- Transaction Menu Simulation ---");
        let step = 1;
        let isMenuRunning = true;

        while (isMenuRunning) {
            let choice = "";
            let amountInput = 0;

            // Simulated user inputs across iterations without using arrays
            if (step === 1) {
                choice = "deposit";
                amountInput = 500;
            } else if (step === 2) {
                choice = "withdraw";
                amountInput = 200;
            } else if (step === 3) {
                choice = "deposit";
                amountInput = -100; // Edge case: negative deposit
            } else if (step === 4) {
                choice = "withdraw";
                amountInput = 50000; // Edge case: withdraw > balance
            } else if (step === 5) {
                choice = "invalid_menu_choice"; // Edge case: invalid option
                amountInput = 0;
            } else if (step === 6) {
                choice = "balance";
                amountInput = 0;
            } else if (step === 7) {
                choice = "exit";
                amountInput = 0;
            } else {
                isMenuRunning = false;
                break;
            }
            step++;

            console.log(`Menu Selection: "${choice}"`);

            // Handle Exit
            if (choice === "exit") {
                console.log("Exiting application...\n");
                break; // Break loop
            }

            // Handle Invalid Menu Choice
            if (choice !== "deposit" && choice !== "withdraw" && choice !== "balance") {
                failedTransactions++;
                console.error(`>> FAILED: "${choice}" is an invalid option. Please select again.\n`);
                continue; // Continue loop
            }

            // Execute valid transaction
            processTransaction(choice, amountInput, handleTransactionResult);
            console.log("");
        }

        // --- Standard FOR Loop: Projected interest calculation (Arithmetic: *, /, %) ---
        console.log("--- 3-Month Growth Projection (Standard FOR loop) ---");
        let projected = balance;
        const annualRate = 0.06; // 6% annual interest
        for (let month = 1; month <= 3; month++) {
            let monthlyInterest = (projected * annualRate) / 12;
            projected += monthlyInterest;
            console.log(`Month ${month}: Projected Balance: $${projected.toFixed(2)}`);
        }

        // --- Rest Parameters Demo ---
        console.log("\n--- Rest Parameters Batch Deposit Calculation ---");
        let batchSum = calculateBatchTotal(100, 250, 150);
        console.log(`calculateBatchTotal(100, 250, 150) = $${batchSum}`);

        // Final summary on exit
        displaySummary("Final Account Summary Upon Exit");

    } else {
        console.error("Access Denied: Cannot access banking menu.");
    }
}

// Run application
runBankingSystem();
