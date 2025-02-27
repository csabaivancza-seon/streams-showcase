import { createReadStream } from "fs";
import csvParser from "csv-parser";
import { measureTime, printMemoryUsage } from "./utils.js";

function getPeopleStream() {
  printMemoryUsage('before reading the file');
  
  const stream = createReadStream('./src/fake_data.csv');
  return stream.pipe(csvParser());
}

/**
 * 
 * @param {ReadableStream} stream 
 * @return {AsyncGenerator<import('./person').Person>}
 */
async function* getPeopleWithFullname(stream) {
  for await (const person of stream) {
    yield { ...person, fullName: `${person.firstName} ${person.lastName}` };
  }
}

/**
 * 
 * @param {ReadableStream} stream 
 * @return {AsyncGenerator<import('./person').Person>}
 */
async function* getPeopleWithFraudsterflag(stream) {
  for await (const person of stream) {
    yield { ...person, isFraudster: person.lastName === 'Anderson' };
  }
}

async function main() {
  printMemoryUsage('before reading the file');
  
  /**
   * @type {import('./person').Person[]}
   */
  const pplWithFullname = []; 

  const peopleStream = getPeopleStream();
  const peopleWithFullname = getPeopleWithFullname(peopleStream);
  const peopleWithFraudsterflag = getPeopleWithFraudsterflag(peopleWithFullname);

  for await (const person of peopleWithFraudsterflag) {
    pplWithFullname.push(person);
  }

  // console.log(pplWithFullname[1])
  
  printMemoryUsage('after transforming');
}

measureTime(main);
