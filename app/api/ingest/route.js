// This is the simplest possible Next.js API route structure.
export async function GET(request) {
    return new Response(JSON.stringify({ status: "API endpoint compiled successfully." }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

export const POST = GET;