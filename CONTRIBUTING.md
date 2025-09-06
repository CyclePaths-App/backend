# CyclePaths-Backend

Idk what to call this doc, but this is what other projects call it so /shrug

## Code Structure:

### Logic

This is where we write the functions that make requests to the Database, and define the structs for each table.

### Controllers

This is where we define the API response logic. We check inputs, decide which logic functions to call, and return status here.

### Routers

This is where we decide connect the request paths with controllers.

### Migrations

This is where we define and initialize our database.

### lib

This is for any common functions for use throughout our project.

### Tests

Where we put the tests.

## Database Structure:

TBD
