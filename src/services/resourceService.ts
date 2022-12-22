// @ts-ignore
import nrand from 'gauss-random'; // mean 0 sd 1
import weighted from 'weighted';
import request from 'request';

import ResourceInfo from '../models/resourceInfo';
import { Dictionary } from 'underscore';

/**
 * Obtain Resource Data
 * @param type Resource type
 * @param attr Resource attribute
 */
export async function getResourceData(type: string, attr: string): Promise<Array<string | number>> {
    console.log('The configuration for mocked data is FAKE_AIDBOX:', process.env.CODA_STATS_API_FHIR_STORE_MOCKED);

    const fakeAidboxEnvVariable = process.env.CODA_STATS_API_FHIR_STORE_MOCKED ? process.env.CODA_STATS_API_FHIR_STORE_MOCKED : 'true';
    const fakeAidbox = JSON.parse(fakeAidboxEnvVariable);
    return (fakeAidbox ? getMockedResource : getAidboxResource)(type, attr);
}

/**
 * Obtains meta-data on available resources.
 */
export async function getResourcesInfo() {
    return Promise.resolve([
        // Mocked data
        new ResourceInfo("patient", "age", new Date(2020, 0, 1), new Date(2021, 0, 1), "number"),
        new ResourceInfo("patient", "sex", new Date(2020, 0, 1), new Date(2021, 0, 1), "string"),
        new ResourceInfo("patient", "teeth", new Date(2020, 0, 1), new Date(2021, 0, 1), "number"),
        new ResourceInfo("patient", "finger", new Date(2020, 0, 1), new Date(2021, 0, 1), "string"),
        new ResourceInfo("episode", "los", new Date(2020, 0, 1), new Date(2021, 0, 1), "number"),
    ]);
}

/**
 * Samples from a normal distribution.
 * @param {number} count Number of Samples
 * @param {number} mean Mean of the draws
 * @param {number} sd Standard deviation of the draws.
 * @returns {number[]}
 */
function rnorm(count: number, mean: number = 0, sd: number = 1): number[] {
    let arr = Array(count);

    for (let i = 0; i < count; i++)
        arr[i] = (nrand() * sd) + mean;

    return arr
}

/**
 * Sample from a category set with probability
 * @param {any[]} categories 
 * @param {number} count 
 * @param {number[]} prob_vector
 * @returns {any[]}
 */
function sample(categories: any[], count: number, prob_vector: number[]): any[] {
    let arr = Array(count);
    for (let i = 0; i < count; i++) {
        arr[i] = weighted.select(categories, prob_vector);
    }
    return arr;
}

/**
 * Obtain mocked resource data.
 * @param type Resource type
 * @param attr Resource attribute
 */
function getMockedResource(type: string, attr: string): Promise<any[]> {
    const N = 100;
    switch ([type, attr].join(':')) {
        case 'patient:age':
            return Promise.resolve(rnorm(N, 55, 20));
        case 'patient:sex':
            return Promise.resolve(sample(['M', 'F'], N, [0.4, 0.6]));
        case 'patient:teeth':
            return Promise.resolve(rnorm(4, 55, 20));
        case 'patient:finger':
            return Promise.resolve(sample(['pinky', 'middle', 'pointer'], 8, [0.2, 0.5, 0.3]));
        case 'episode:los':
            return Promise.resolve(rnorm(N, 15, 5));

        default:
            return Promise.reject(new Error(`No data for resource ${type}:${attr}`));
    }
}

/**
 * Obtain real resource data.
 * 
 * @param type Resource type
 * @param attr Resource attribute
 */
function getAidboxResource(type: string, attr: string): Promise<any[]> {

    return new Promise((resolve, reject) => {
        // FIXME(malavv): This code needs to be finalized.
        // TODO: fill these out with the appropriate info
        const aidboxUrl = process.env.CODA_FHIR_STORE_URL;
        //const aidboxToken = process.env.CODA_FHIR_STORE_TOKEN;

        // TODO: verify that resourceType and resourceAttribute are whitelisted

        // Get all resources with that type
        const url = `${aidboxUrl}/${type}`

        // Build the HTTP request to the AidBox server
        const requestOptions = {
            url: url,
            headers: {
                'accept': 'application/json',
                'Content-type': 'application/json',
                //'Authorization': `Bearer ${aidboxToken}`
            }
        }

        // Send the request to the AidBox server
        request(requestOptions, (error, response, body) => {
            // Handle successful queries
            if (!error && response.statusCode == 200)
                resolve(JSON.parse(body).map((resource: Dictionary<any[]>) => resource[attr]));
            // Handle errors
            else
                console.error(error);
            reject(error);
        })
    });
}
