import { ethers } from "hardhat";
import * as dotenv from "dotenv";

import prompt from "prompt-sync";

import abi from "../artifacts/contracts/TokenizedBallot.sol/Ballot.json";

dotenv.config();

const CONTRACT_ADDRESS = "";
const contractABI = abi.abi;

const showPrompt = prompt();

async function main() {
  const provider = ethers.getDefaultProvider("goerli");

  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

  const voter = showPrompt("Please your wallet address: ");

  const other = showPrompt(
    "Please wallet address you want to delgate your votes to: "
  );

  const amount = showPrompt(
    "Please enter the amount of votes you want to delegate: "
  );

  try {
    const tx = await contract.connect(voter).delegate(other, amount);
    await tx.wait();
    console.log("Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    console.log(`You have delgate ${amount} voting power to ${other}`);
    console.log(receipt);
  } catch (err) {
    console.log(err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
