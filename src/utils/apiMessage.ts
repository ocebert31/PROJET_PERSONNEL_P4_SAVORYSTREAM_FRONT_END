export function extractSuccessMessage(result: unknown, fallback: string): string {
    if (typeof result === "object" && result !== null && "message" in result) {
        const m = (result as { message: unknown }).message;
        if (typeof m === "string" && m.trim()) return m.trim();
    }
    return fallback;
}
