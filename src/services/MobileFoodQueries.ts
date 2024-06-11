// csvReader.mjs
import fs from 'fs';
import csv from 'csv-parser';

export function createCsvReadStream(filePath: string): Promise<any[]> {
  const results: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', () => {
        console.log('CSV file proccessed sucessfully');
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

