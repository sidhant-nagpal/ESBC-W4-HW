import { ethers } from "hardhat";
import * as dotenv from "dotenv";

import prompt from "prompt-sync";

import abi from "../artifacts/contracts/ERC20Votes.sol/MyToken.json";

dotenv.config();

const CONTRACT_ADDRESS = "0xF6e8FF785bA56C14DeE6056d457e2F78DB868Ece";
const contractABI = abi.abi;

const showPrompt = prompt();

async function main() {
  const provider = ethers.getDefaultProvider("goerli");

  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

  const voter = showPrompt("Please your wallet address: ");

  let votePower = await contract.getVotes(voter);
  console.log(
    `The voter ${voter} has voting power of ${ethers.utils.formatEther(
      votePower
    )}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
