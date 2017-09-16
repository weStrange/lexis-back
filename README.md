# lexis-back
## Installation instructions
1. Add `.env` file to the root of the project. The file is listed in `.gitignore`
and contains sensitive information that should never be checked to git.
Add to the file the followong environmental variables:
`MONGO_HOST`, `MONGO_USER`, `MONGO_PASSWORD` - for making a connection with your `mongodb`
`SESSION_SECRET` - secret used for JWT generation and validation
2. run `yarn install` to install dependencies
3. run your `mongod` with the configurations specified in the `.env` file
4. Run redis server by executing
```
redis-server
```
If it is not yet install on your machine, isntall it by executing
```
npm install redis -g
```
5. run `yarn run devserver` to start the local development server
**NOTES**: If you do not have yarn, you can install it by `npm install -g yarn` (Yarn is better than NPM)
## Common scripts
* `yarn test`: start running test. Linter is run before test, so any lint-error must be cleared before you can start testing. Flow type checking is also run before the tests but after the linter check.
