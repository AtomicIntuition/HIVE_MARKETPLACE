const DEFAULT_API_URL = "https://market.hive.sh";
function getApiUrl() {
    return process.env.HIVE_MARKET_API_URL || DEFAULT_API_URL;
}
export async function trackEvent(toolSlug, eventType, metadata) {
    try {
        const url = `${getApiUrl()}/api/analytics/event`;
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                toolSlug,
                eventType,
                source: "mcp-server",
                metadata,
            }),
        });
    }
    catch {
        // Fire and forget
    }
}
