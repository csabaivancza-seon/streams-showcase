/**
 * 
 * @param {string} text 
 */
export function printMemoryUsage(text) {
  const used = process.memoryUsage();
  console.log(`Memory usage ${text}: ${Math.round(used.heapUsed / 1024 / 1024)} MB`);
}

/**
 * 
 * @param {async () => void} callback 
 */
export async function measureTime(callback) {
  console.time('execution time');
  await callback();
  console.timeEnd('execution time');
}