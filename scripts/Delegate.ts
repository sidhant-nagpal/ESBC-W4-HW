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

  const signer = await ethers.getSigners();

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractABI,
    signer[0]
  );

  const voter = showPrompt("Please your wallet address: ");

  const other = showPrompt(
    "Please wallet address you want to delgate your votes to: "
  );

  // const amount = showPrompt(
  //   "Please enter the amount of votes you want to delegate: "
  // );

  try {
    const tx = await contract.delegate(other);
    await tx.wait();
    console.log("Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    console.log(`You have delgate voting power to ${other}`);
    console.log(receipt);
  } catch (err) {
    console.log(err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
