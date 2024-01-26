# ESBC-W3-HW Group 10

Instructions to run Deployment.ts:

- Create a file `accounts.json` mentioning all the accounts that should get voting tokens
- Create a file `.env` and add an environment variable called `SOMETHING_IMPORTANT` with your private key for the Goerli chain account.
- Run `yarn hardhat run scripts/Deployment.ts`

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
