import { ethers } from "hardhat";
import * as dotenv from "dotenv";

import prompt from "prompt-sync";

import abi from "../artifacts/contracts/TokenizedBallot.sol/Ballot.json";

dotenv.config();

const CONTRACT_ADDRESS = "0x400558Db1f72cc04A1160fCCD3Cd7E1CA324D303";
const contractABI = abi.abi;

const showPrompt = prompt();

async function main() {
  const provider = ethers.getDefaultProvider("goerli");

  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

  const voter = showPrompt("Please your wallet address: ");

  let votePower = await contract.votePower(voter);
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
