export default interface BreakdownSummarizeResponse {
    query: string;
    result: { periodStart: string, periodCount: number | null }[];
    error?: string;
}