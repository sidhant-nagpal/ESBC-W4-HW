import abi from "../artifacts/contracts/TokenizedBallot.sol/Ballot.json";
import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x400558Db1f72cc04A1160fCCD3Cd7E1CA324D303";
const contractABI = abi.abi;
const PROPOSALS_COUNT = 3;

async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

    console.log("\n---------RESULTS---------\n");
    for(let i = 0; i<PROPOSALS_COUNT; i++){
        const result = await contract.proposals(i);
        const name = ethers.utils.parseBytes32String(result.name);
        const votes = ethers.utils.formatEther(result.voteCount);
        console.log(`${name} -------> ${votes}`);
        if(i == PROPOSALS_COUNT-1){
            process.exit();
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});