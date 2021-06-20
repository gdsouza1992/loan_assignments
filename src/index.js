const { create_facilities, read_setup_data, read_loan_data } = require("./lib/setup");
const { allocate_loan, write_allocations, write_yields } = require("./lib/process");

const main = async () => {
  // print process.argv
  const input_folder = process.argv[2];

  const { facilities, covenants, banks } = await read_setup_data(input_folder);
  const facility_map = create_facilities(facilities, covenants);
  const loans = await read_loan_data(input_folder);
  const allocations = [];
  
  // simulate the a stream of loans
  for (const loan of loans) {
    const allocation = allocate_loan(loan, facility_map);
    allocations.push(allocation);
  }

  write_allocations(allocations);
  write_yields(facility_map)
}

main();





