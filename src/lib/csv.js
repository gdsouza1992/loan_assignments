const csv_reader = require('csvtojson')
const { writeToPath } = require('@fast-csv/format');

const read_csv_file = async (path) => {
  return csv_reader().fromFile(path);
}

const write_csv_file = async (write_path, data) => {
  writeToPath(write_path, data, { headers: true })
    .on('error', err => console.error(err))
    .on('finish', () => console.log(`Done writing ${data.length} rows to ${write_path}`));
};

module.exports = { read_csv_file, write_csv_file };
