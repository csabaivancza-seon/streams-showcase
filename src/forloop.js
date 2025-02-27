import { createReadStream } from "fs";
import csvParser from 'csv-parser';
import { measureTime, printMemoryUsage } from "./utils.js";

/**
 * 
 * @returns {Promise<import('./person').Person[]>}
 */
export async function getAllPeopleInOneChunk() {
  const stream = createReadStream('./src/fake_data.csv');

  return new Promise((resolve) => {
    /**
     * @type {import('./person').Person[]}
     */
    const result = [];

    const processData = (data) => { result.push(data); };    
    const endStream = () => { resolve(result); };

    stream.pipe(csvParser())
      .on('data', processData)
      .on('end', endStream);
  });
}

/**
 * 
 * @param {import('./person').Person[]} people 
 * @returns 
 */
function getPeopleWithFullname(people) {
  return people.map((person) => {
    return { ...person, fullName: `${person.firstName} ${person.lastName}` };
  });
}

/**
 * 
 * @param {import('./person').Person[]} people 
 * @returns 
 */
function getPeopleWithFraudsterflag(people) {
  return people.map((person) => {
    return { ...person, isFraudster: person.lastName === 'Anderson' };
  });
}

async function main() {
  printMemoryUsage('before reading the file');

  const people = await getAllPeopleInOneChunk();

  printMemoryUsage('after reading the file content');
  
  const dataWithFullName = getPeopleWithFullname(people);
  const fraudsters = getPeopleWithFraudsterflag(dataWithFullName);

  printMemoryUsage('after transforming');
}

measureTime(main);
