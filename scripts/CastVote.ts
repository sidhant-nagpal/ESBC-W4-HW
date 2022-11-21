import abi from "../artifacts/contracts/TokenizedBallot.sol/Ballot.json";
import { ethers } from "hardhat";
import prompt from "prompt-sync";
import { parse } from "path";
import { parseEther } from "ethers/lib/utils";

const CONTRACT_ADDRESS = "0x400558Db1f72cc04A1160fCCD3Cd7E1CA324D303";
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

  const proposal = showPrompt(
    "Please enter the index of the proposal you want to vote for: "
  );
  const amount = showPrompt("Please enter the amount of votes: ");

  try {
    const voteTx = await contract.vote(
      proposal,
      ethers.utils.parseEther(amount)
    );
    console.log("Awaiting transaction confirmation....");
    const receipt = await voteTx.wait();
    console.log(
      `Your vote of ${amount} to Proposal #${proposal} is successful`
    );
    console.log(receipt);
  } catch (err) {
    console.log(err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
