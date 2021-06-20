const { read_csv_file } = require("./csv");

// Read the csv files
const BASE_PATH = './small';
// const BASE_PATH = './large';

const create_facilities_map = (facilities, ) => {
  const facility_map = new Map();
  for (const facility of facilities) {
    // create a new facility
    const id = Number(facility.id);
    if(!facility_map.has(id)) {
      facility_map.set(id, {
        facility_id: id,
        initial_amount: Number(facility.amount),
        amount: Number(facility.amount),
        interest_rate: Number(facility.interest_rate),
        bank_id: Number(facility.bank_id),
        banned_states: [],
        max_default_likelihood: 0,
        cumulative_yield: 0
      });
    } else {
      console.error('Multiple facilities with the same id exists');
    }
  }

  return facility_map;
};

const add_covenant_data_to_facilities_map = (facility_map, covenants) => {
  for (const covenant of covenants) {
    // add covenant likelihood and banned states to facilities.
    const facility_id = Number(covenant.facility_id);
    if (facility_map.has(facility_id)) {
      const facility = facility_map.get(facility_id);
      // Update the likelihood if exists
      if (!facility.max_default_likelihood && covenant.max_default_likelihood) {
        facility.max_default_likelihood = Number(covenant.max_default_likelihood);
      } 
      // Add the covenant state to the facility if exists
      if(covenant.banned_state) {
        facility.banned_states.push(covenant.banned_state);
      }
    } else {
      console.error('Covenant has a facility id that does not exist');
    }
  }
};

const create_facilities = (facilities, covenants) => {
  const facility_map = create_facilities_map(facilities);
  add_covenant_data_to_facilities_map(facility_map, covenants);
  return facility_map
}

const read_setup_data = async (input_folder) => {
  console.log(input_folder)
  const covenants = await read_csv_file(`${input_folder ? input_folder : BASE_PATH}/covenants.csv`);
  const facilities = await read_csv_file(`${input_folder ? input_folder : BASE_PATH}/facilities.csv`);
  const banks = await read_csv_file(`${input_folder ? input_folder : BASE_PATH}/banks.csv`);

  return {
    covenants: covenants,
    facilities: facilities,
    banks: banks,
  }
}

const read_loan_data = (input_folder) => {
  return read_csv_file(`${input_folder ? input_folder : BASE_PATH}/loans.csv`);
}

module.exports = { create_facilities, read_setup_data, read_loan_data };