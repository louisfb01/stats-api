import { runFreq, runMean, SuppressedResult } from '../../src/services/execService';


test(`Command 'freq' through runFreq`, async () => {
    // Basic function
    expect(await runFreq([...'aaaaabbbbb']))
        .toStrictEqual({ 'freq': { 'a': 5, 'b': 5 }, n: 10 });
    // Exactly Zero Count
    expect(await runFreq([] as string[]))
        .toStrictEqual({ 'freq': {}, n: 0 });
    // Suppression
    expect(await runFreq([...'aaaa']))
        .toStrictEqual(SuppressedResult);
    expect(await runFreq([...'aaaaabbb']))
        .toStrictEqual(SuppressedResult);
});

test(`Command 'mean' through runMean`, async () => {
    // Basic function
    expect(await runMean([1, 2, 3, 4, 5, 6]))
        .toStrictEqual({ 'mean': 21 / 6, n: 6, var: 3.5 });
    // Exactly Zero Count
    expect(await runMean([] as number[]))
        .toStrictEqual({ 'mean': 0, n: 0 });
    // Suppression
    expect(await runMean([1, 2, 3]))
        .toStrictEqual(SuppressedResult);
});