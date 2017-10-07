# lexis-back

## Prerequisites

You will need

- Node.js V8.6.0+
- Yarn globally installed on your system. To install yarn run
`npm install -g yarn` command


## Configuring and running the project
1. Add `.env` file to the root of the project. The file is listed in
`.gitignore` and contains sensitive information that should never be
checked to git.
Add to the file the followong environmental variables:
`MONGO_HOST`, `MONGO_USER`, `MONGO_PASSWORD` - for making a connection
with your `mongodb` `SESSION_SECRET` - secret used for JWT generation
and validation
2. Run `yarn install` to install dependencies
3. Set up your MongoDB to have a database with name "lexis" and a user
with **readWrite** permissions for this database. Run your MongoDB with
`mongod` command.
4. Compile the project by running `yarn compile` command
5. Start the project by running `yarn start` command

## Running tests
To run the tests use `yarn test` command