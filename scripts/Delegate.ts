import { ethers } from "hardhat";
import * as dotenv from "dotenv";

import prompt from "prompt-sync";

import abi from "../artifacts/contracts/ERC20Votes.sol/MyToken.json";

dotenv.config();

const CONTRACT_ADDRESS = "0xF6e8FF785bA56C14DeE6056d457e2F78DB868Ece";
const contractABI = abi.abi;

const showPrompt = prompt();

async function main() {
  const signer = await ethers.getSigners();

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractABI,
    signer[0]
  );

  const other = showPrompt(
    "Please enter wallet address you want to delgate your votes to: "
  );

  try {
    const tx = await contract.delegate(other);
    console.log("Waiting for transaction confirmation...");
    await tx.wait();
    const receipt = await tx.wait();
    console.log(`You have delgated voting power to ${other}`);
    console.log(receipt);
  } catch (err) {
    console.log(err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
