# lexis-back
## Installation instructions
1. run `yarn install` to install dependencies
2. run `flow-lib install` to install flow lib dependencies
3. run `yarn run devserver` to start the local development server
**NOTES**: If you do not have yarn, you can install it by `npm install -g yarn` (Yarn is better than NPM)
## Common scripts
* `yarn run start` : start the developement server
* `yarn run format`: format your code to conform to our standard. Automatically fix many things. You can choose to run this manually, but the code will be run whenever you commit your code.
* `yarn run lint`: show you linting error. This uses standard under the hood. Try to use some integration in your editor to see lint-error in real time.
* `yarn run build`: generate a production-ready version of the app. The production director will be `build` by default. You can then serve this folder.
* `yarn run test`: start running test. Linter is run before test, so any lint-error must be cleared before you can start testing.
* `yarn run storybook`: Storybook is an environment to develop your component in isolation. It's really useful to work on a particular module without having to bother with mocking actions and api calls, or navigating through your views to get to the work-in-progress view. Storybook also force you to think about the component API, and how it interacts with the rest of your codebase. The default storybook server is 9009. See terminal log for the correct port of the server.

## FAQ
**REMEMBER TO FOLLOW ALL INSTALLATION STEPS BEFORE PROCEED**
* **I cannot run the linter**: `brew install watchman` if you are on Mac. If you are on windows, you can find the equivalent package

I cannot highlight all the pitfall at the moment. So if there is something not working at the moment, please contact me via slack

## EDITOR
Editor is an important part in every project. I recommend **VSCODE** because it has build in feature for web development. Its wonderful.
The project has high intergration with VSCODE. Download and install these packages for most heavenly development experience
* Babel Javascript: For code highlighting even for styled-components!
* Eslint: Integrates ES into VSCODE
* Jest: Integrates Jest tricks into VSCODE
* vscode-icons: Beatiful icons
* debugger-for-chrome: no more switching to browser to `console.log`. You can do it right in VS! I configured it for you :P
