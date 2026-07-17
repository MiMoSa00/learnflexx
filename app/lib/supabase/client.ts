import { createBrowserClient } from '@supabase/ssr'

// We intercept the global fetch to prevent unhandled promise rejections
// if the Supabase project is deleted (DNS fails).
if (typeof window !== 'undefined' && !(window as any)._fetchPatched) {
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
        const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');
        if (url.includes('soutoilrbuelwyqfffee.supabase.co') || url.includes('supabase.co')) {
            try {
                const response = await originalFetch(input, init);
                return response;
            } catch (err: any) {
                if (err.message === "Failed to fetch" || err.message?.includes('fetch')) {
                    // Return a fake valid JSON response to prevent the Supabase SDK from throwing an unhandled rejection
                    return new Response(JSON.stringify({
                        error: "server_error",
                        error_description: "Supabase project connection failed. Please ensure the project is active and that your environment variables match the correct project on supabase.com."
                    }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                throw err;
            }
        }
        return originalFetch(input, init);
    };
    (window as any)._fetchPatched = true;
}

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}