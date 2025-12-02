import { checkBudgetStatus } from '@/workers/budget'; 
import { processRecurringTransactions } from '@/workers/recurring';
// NOTE: We removed the dependency on the external client that was failing the build.

// This is the standard Next.js function for handling API requests (GET/POST).

export async function GET(request) {

    console.log("Ingest API Route Called. Running workers...");

    // Trigger the worker logic:
    await checkBudgetStatus();
    await processRecurringTransactions();

    return new Response(JSON.stringify({ status: "Workers executed successfully." }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

// Export the same function for POST requests as well
export const POST = GET;