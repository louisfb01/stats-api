export default interface BreakdownResponse {
    query: string;
    result: { periodStart: string, periodCount: number | null }[];
    field: string;
    fieldType: string;
    error? : string;
}