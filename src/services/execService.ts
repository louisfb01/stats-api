import _, { any, Dictionary } from 'underscore';

import { getResourceData, getResourcesInfo } from './resourceService';

// Result for the 'Freq' command
interface FreqRes { freq: _.Dictionary<number>; n: number; }
// Result for the 'Mean' command
interface MeanRes { mean: number; n: number; }
// Intenal identifiers pkg for a resource
interface ResId { type: string; attribute: string; }
// Type of a suppressed result (Suppressed result are literally this class, not an object instance.)
export abstract class SuppressedResult { }

/**
 * Performs a "command" or stats procedure on the data from a defined resource.
 * @param command Command to execute
 * @param resource Resource to obtain data from
 */
export async function execCommand(command: string, resType: string, resAttr: string): Promise<any> {

    const resourcesMetadata = await getResourcesInfo();
    const resource: ResId = { type: resType, attribute: resAttr };
    const metadata = _.findWhere(resourcesMetadata, resource);

    if (reqDataTypeFor(command) != metadata?.datatype)
        throw new Error(`Incorrect datatype for command ${command}. Expected ${reqDataTypeFor(command)} received ${metadata?.datatype}`);

    const results = await runCommand(command, resource);

    return {
        'command': command,
        'resource': metadata,
        'value': (results === SuppressedResult) ? 'suppressed' : results
    }
}

/**
 * Is the command valid and known.
 * @param command ID of the command
 */
export function validCommand(command: string): boolean {
    switch (command) {
        case 'mean':
        case 'freq':
            return true;
        default:
            return false;
    }
}

/**
 * What type of data is required by a command.
 * @param cmd Command to be executed
 */
function reqDataTypeFor(cmd: string): string | undefined {
    switch (cmd) {
        case 'mean': return 'number';
        case 'freq': return 'string';
        default: return undefined;
    }
}

/**
 * Performs computation, should be internal to "execCommand".
 * @param command Command to perform
 * @param resource Resource to get data from
 */
async function runCommand(command: string, resource: ResId): Promise<(FreqRes | MeanRes | SuppressedResult)> {
    const data: Array<string | number> = await getResourceData(resource.type, resource.attribute);
    if (data.length < 5 && data.length > 0)
        return SuppressedResult;

    switch (command) {
        case 'mean':
            return runMean(data as number[]);
        case 'freq':
            return runFreq(data as string[]);
        default:
            throw new Error(`Invalid Command ${command}`);
    }
}

/**
 * Frequency count
 * @param data Array of factors/strings
 */
export async function runFreq(data: string[]): Promise<FreqRes | SuppressedResult> {
    const n = data.length;
    const freqs: Dictionary<number> = _.countBy(data, (v: any) => v);
    const counts = [...Object.values(freqs)] as number[];

    if (counts.some(n => n < 5 && n != 0))
        return SuppressedResult;

    return {
        'freq': _.countBy(data, (v: any) => v),
        'n': n
    };
}

/**
 * Arithmetic mean.
 * @param data Array of real numbers.
 */
export async function runMean(data: number[]): Promise<MeanRes | SuppressedResult> {
    const sum = (arr: number[]) => arr.reduce((sum, el) => sum + el);
    const n = data.length;

    if (n < 5 && n > 0)
        return SuppressedResult;
    if (n == 0)
        return { 'mean': 0, 'n': 0 /* variance is undefined */ }

    const mean = sum(data) / n;
    const smpl_var = sum(data.map(x => (x - mean) * (x - mean))) / (n - 1)

    return {
        'mean': mean,
        'n': n,
        'var': smpl_var
    };
}