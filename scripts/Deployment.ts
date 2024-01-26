import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { MyToken__factory, Ballot__factory } from "../typechain-types";
import accountsWithVotingPower from "../accounts.json";

dotenv.config();

const MINT_VALUE = ethers.utils.parseEther("100");
const PROPOSAL_NAMES = ["Solidity", "Vyper", "Yul"];

async function main() {
  // Ensure that accounts.json is created and has addresses
  if (!accountsWithVotingPower || accountsWithVotingPower.length < 1) {
    throw new Error(
      "Please create accounts.json in the root folder with all the accounts that should get voting tokens"
    );
  }

  // All accounts supported on the current network
  const accounts = await ethers.getSigners();

  const [deployer] = accounts;

  // Deploy ERC20 MyToken contract
  const erc20TokenContractFactory = new MyToken__factory(deployer);
  const erc20TokenContract = await erc20TokenContractFactory.deploy();
  await erc20TokenContract.deployed();
  console.log(`Token contract deployed at ${erc20TokenContract.address}\n`);

  const mintVotingTokensPromises = [];
  for (let i = 0; i < accountsWithVotingPower.length; i++) {
    const mintTx = await erc20TokenContract.mint(
      accountsWithVotingPower[i],
      MINT_VALUE
    );
    mintVotingTokensPromises.push(mintTx.wait());
  }

  await Promise.all(mintVotingTokensPromises);

  console.log("Tokens minted to accounts\n");

  const currentBlock = await ethers.provider.getBlock("latest");
  // Deploy TokenizedBallot contract
  const tokenizedBallotContractFactory = new Ballot__factory(deployer);
  const tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(
    PROPOSAL_NAMES.map((name) => ethers.utils.formatBytes32String(name)),
    erc20TokenContract.address,
    currentBlock.number
  );
  await tokenizedBallotContract.deployed();
  console.log(
    `Tokenized Ballot contract deployed at ${tokenizedBallotContract.address} with target block as ${currentBlock.number}\n`
  );

  // List proposals
  const proposals = await tokenizedBallotContract.getProposals();
  console.log(
    "Proposals:",
    proposals.map((p: any) => ethers.utils.parseBytes32String(p.name))
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
