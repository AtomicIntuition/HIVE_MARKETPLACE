function extractKeywords(text) {
    const stopWords = new Set([
        "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would", "could",
        "should", "may", "might", "can", "shall", "to", "of", "in", "for",
        "on", "with", "at", "by", "from", "as", "into", "through", "during",
        "before", "after", "above", "below", "between", "and", "but", "or",
        "not", "no", "so", "if", "then", "than", "too", "very", "just",
        "about", "up", "out", "that", "this", "it", "i", "my", "me", "we",
        "want", "need", "like", "use", "using", "help", "make", "get",
    ]);
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !stopWords.has(w));
}
function toSummary(tool) {
    return {
        name: tool.name,
        slug: tool.slug,
        description: tool.description,
        rating: tool.rating,
        installCount: tool.installCount,
        pricing: tool.pricing.model === "free" ? "Free" : `$${tool.pricing.price}/${tool.pricing.unit}`,
        verified: tool.verified,
        category: tool.category,
    };
}
export function recommendTools(tools, useCase, maxResults = 5) {
    const keywords = extractKeywords(useCase);
    if (keywords.length === 0)
        return [];
    const scored = [];
    for (const tool of tools) {
        let score = 0;
        const reasons = [];
        const nameLower = tool.name.toLowerCase();
        const descLower = tool.description.toLowerCase();
        for (const keyword of keywords) {
            if (nameLower.includes(keyword)) {
                score += 10;
                reasons.push(`Name matches "${keyword}"`);
            }
            if (tool.tags.some((t) => t.toLowerCase().includes(keyword))) {
                score += 8;
                reasons.push(`Tagged with "${keyword}"`);
            }
            if (tool.category.toLowerCase().includes(keyword)) {
                score += 6;
                reasons.push(`In ${tool.category} category`);
            }
            if (descLower.includes(keyword)) {
                score += 5;
                reasons.push(`Description mentions "${keyword}"`);
            }
            if (tool.features.some((f) => f.toLowerCase().includes(keyword))) {
                score += 4;
                reasons.push(`Feature: "${keyword}"`);
            }
        }
        if (score > 0) {
            // Quality multiplier
            const ratingBonus = tool.rating / 5;
            const installBonus = Math.min(tool.installCount / 50000, 1);
            const verifiedBonus = tool.verified ? 1.2 : 1.0;
            const qualityMultiplier = (ratingBonus + installBonus) * verifiedBonus;
            score *= qualityMultiplier;
            // Deduplicate reasons
            const uniqueReasons = [...new Set(reasons)].slice(0, 4);
            scored.push({ tool, score, reasons: uniqueReasons });
        }
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, maxResults).map(({ tool, score, reasons }) => ({
        tool: toSummary(tool),
        score: Math.round(score * 10) / 10,
        reasons,
    }));
}
