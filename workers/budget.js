// workers/budget.js
export async function checkBudgetStatus() {
    console.log("Budget check worker initiated.");
    return { message: "Budget status check completed." };
}

// workers/recurring.js
export async function processRecurringTransactions() {
    console.log("Recurring transaction processing initiated.");
    return { message: "Recurring transactions processed." };
}