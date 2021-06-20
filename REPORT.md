1. How long did you spend working on the problem? What did you find to be the most difficult part?
```
I spend an hour going through the problem and understanding what was expected looking at the data. Open questions that I had were can one facility be assigned to more than one loan, What happens when there is missing data? The sample output cleared those doubts. 
I then spent 5 to 10 minutes to copy the data into a google sheet and did some data processing to create the sample output to check if my understanding of the requirements were correct.
Then spent 3 hours to code the solution. The most tedious part was working with the csv reader and writer apis since that was new and documentation.
```
2. How would you modify your data model or code to account for an eventual introduction of new, as-of-yet unknown types of covenants, beyond just maximum default likelihood and state restrictions?
```
An addition of a new covenant would simply be finding the facility for it and updating the existing facility map with the new constraints. 
For a new covenant type it would mean adding a new type of constratint to the facility map and modifying the allocation funtion to consume the same.
```
3. How would you architect your solution as a production service wherein new facilities can be introduced at arbitrary points in time. Assume these facilities become available by the finance team emailing your team and describing the addition with a new set of CSVs.
```
I'd expose an api to update the facility map by adding a new key = facility id and value = facility and its covenants. Since its already in memory that should be pretty easy.
It would make sense to have an update fucntion that takes in the new csv file that appends its contents to the existing file and import the same into the facility_map.
```
4. Your solution most likely simulates the streaming process by directly calling a method in your code to process the loans inside of a for loop. What would a REST API look like for this same service? Stakeholders using the API will need, at a minimum, to be able to request a loan be assigned to a facility, and read the funding status of a loan, as well as query the capacities remaining in facilities.
```
I'd expose the following.
Gets a list of all the facilities.
GET /facilities/

Gets a single facility by id. (Should return the loan capacity)
GET /facilities/{facility_id}/

Assign a loan to a facility.
POST /facilities/{facility_id}/loans/{loan_id}/

Get the loan by id.
GET /loans/{loan_id}
```
5. How might you improve your assignment algorithm if you were permitted to assign loans in batch rather than streaming? We are not looking for code here, but pseudo code or description of a revised algorithm appreciated.
```
One problem of the single stream loan assignment is there is a possibility that a loan may not have an assigment due to the way previous loans were assigned in a greedy manner. Have this process changed to use a batch instead would help in these situations.
We could take all the loans in the batch and assign the loans to facility using a some form of combinatorial_optimization[https://en.wikipedia.org/wiki/Combinatorial_optimization] like a knapsack problem. The solution can be enhanced/modeled as a weighted knapsack problem with yield being the weights to maximize profits. 
Loans that still didnt get assigned at this time could be pushed into a backlog batch that would eventually use the greedy solution to ensure that loans dont wait forever to get assingments.
```
6. Discuss your solution’s runtime complexity.
For a problem with c covenants, f facilities, l loans. Runtime complexity is O(lf) which comes from the loan assignment step.
```
  read input data // O(f) + O(c) + O(l)

  create_facilities_map(facilities) // O(f)
  
  // Having the facilities as a map here makes the facility lookup for a map O(1)
  add_covenant_data_to_facilities_map() // O(c) 

  for (const loan of loans) { O(l)
    get the permitted_facilities O(f)
    get_best_yield O(f)
    update_facility_after_assignment O(1)
  }

  write_allocations(allocations); O(l)
  write_yields(facility_map); O(f)
```

