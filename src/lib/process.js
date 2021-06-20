const { write_csv_file } = require("./csv");

const update_facility_after_assignment = (facility_map, facility_id, loan, expected_yield) => {
  const facility = facility_map.get(facility_id);
  const { amount: loan_amount } = loan;
  facility.amount = facility.amount - loan_amount;
  facility.cumulative_yield = facility.cumulative_yield + expected_yield;
}

const get_best_yield = (loan, permitted_facilities) => {
  const {
    id: loan_id,
    interest_rate: loan_interest_rate,
    amount: loan_amount,
    default_likelihood: loan_default_likelihood
  } = loan;

  let best_yield_association = { loan: undefined, facility_id: undefined, expected_yield: 0 };

  permitted_facilities.forEach((facility) => {
    const expected_yield = Math.round(((1 - loan_default_likelihood) * loan_interest_rate * loan_amount) - 
    (loan_default_likelihood * loan_amount) - 
    (facility.interest_rate * loan_amount))

    if (expected_yield >= best_yield_association.expected_yield) {
      best_yield_association = { 
        loan, 
        facility_id: facility.facility_id, 
        expected_yield,
      };
    }
  });

  return best_yield_association;
}

const allocate_loan = (loan, facility_map) => {
  const {
    id: loan_id,
    interest_rate: loan_interest_rate,
    amount: loan_amount,
    default_likelihood: loan_default_likelihood,
    state: loan_state
  } = loan;

  // loan state not in facility banned states
  // loan amount < facility amount
  // loan_default_likelihood < fac max default
  const facilities = [...facility_map.values()];
  const permitted_facilities = facilities.filter(facility => {
    return !facility.banned_states.includes(loan_state) && 
      facility.max_default_likelihood >= loan_default_likelihood && 
      facility.amount >= loan_amount
  });

  const { loan: assigned_loan, facility_id, expected_yield } = get_best_yield(loan, permitted_facilities);
  update_facility_after_assignment(facility_map, facility_id, assigned_loan, expected_yield);

  return {
    loan_id: assigned_loan.id,
    facility_id: facility_id,
  };
};


const write_allocations = (allocations) => {
  write_csv_file('assignments.csv', allocations);
};

const write_yields = (facility_map) => {
  const facilities = [...facility_map.values()];
  const yields = facilities.map(facility => {
    return ({
      facility_id: facility.facility_id,
      expected_yield: facility.cumulative_yield
    });
  })
  write_csv_file('yields.csv', yields);
};

module.exports = { allocate_loan, write_allocations, write_yields };