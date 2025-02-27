import { createReadStream } from "fs";
import csvParser from "csv-parser";
import { Transform } from "stream";
import { measureTime, printMemoryUsage } from "./utils.js";

function getPeopleStream() {
  printMemoryUsage('before reading the file');
  
  const stream = createReadStream('./src/fake_data.csv');
  return stream.pipe(csvParser());
}

/**
 * 
 * @returns {Transform}
 */
function addFullName() {
  return new Transform({
    objectMode: true,
    /**
     * 
     * @param {import("./person.js").Person} chunk 
     * @param {*} encoding 
     * @param {*} callback 
     */
    transform(chunk, encoding, callback) {
      this.push({ ...chunk, fullName: `${chunk.firstName} ${chunk.lastName}` });
      callback();
    }
  });
}

/**
 * 
 * @returns {Transform}
 */
function flagFraudster() {
  return new Transform({
    objectMode: true,
    /**
     * 
     * @param {import("./person.js").Person} chunk 
     * @param {*} encoding 
     * @param {*} callback 
     */
    transform(chunk, encoding, callback) {
      this.push({ ...chunk, isFraudster: chunk.lastName === 'Anderson' });
      callback();
    }
  });
}

function main() {
  return new Promise( r => {
    /**
     * @type {import('./person').Person[]}
     */
    const result = [];
    const peopleStream = getPeopleStream();

    peopleStream
      .pipe(addFullName())
      .pipe(flagFraudster())
      .on('data', (person) => {
        result.push(person); 
      })
      .on('end',  () => {
        printMemoryUsage('after transforming');
        r();
      });
  });
}

measureTime(main);
