import { checkBudgetStatus } from '@/workers/budget'; 
import { processRecurringTransactions } from '@/workers/recurring';

// This endpoint handles scheduled tasks (like recurring transactions and budget alerts).
// In a final setup, this URL would be added to an external scheduling service (like a cron job).

export async function GET(request) {
    // You can add logic here to only allow specific incoming requests (e.g., from your scheduler)

    console.log("Ingest API Route Called. Running workers...");

    // Example: Manually trigger the worker logic for testing or manual schedules
    await checkBudgetStatus();
    await processRecurringTransactions();

    return new Response(JSON.stringify({ status: "Workers executed successfully." }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

// Use the same function for POST to handle different scheduler methods
export const POST = GET;