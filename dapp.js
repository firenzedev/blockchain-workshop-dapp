async function isConnected() {
  if (typeof window.ethereum === "undefined") {
    return Promise.reject(new Error("Please install Metamask"));
  }
  return Promise.resolve(window.ethereum.isConnected());
}


// Application Binary Interface 
async function login() {
  return window.ethereum
    .request({ method: "eth_requestAccounts" })
    .then((account) => {

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      playerContract = new ethers.Contract(
        PLAYER_CONTRACT_ADDRESS,
        abi,
        signer
      );


      return Promise.resolve(account[0]);
    });
}

let playerContract;

const PLAYER_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const abi = [
  "function buyBingoCard() external payable",
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "cardNumbers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  "function callBingo() external",
  "function withdraw() external",
];

async function buyBingoCard() {
  const numbers = await getMyNumbers();
  if (numbers.length > 0) {
    return { numbers };
  }

  try {
    const tx = await playerContract.buyBingoCard({
      value: ethers.utils.parseUnits("0.01", "ether"),
    });
    await tx.wait();
    const numbers = await getMyNumbers();
    return { numbers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getMyNumbers() {
  const numbers = [];
  try {
    for (let i = 0; i < 6; i++) {
      let cardNumbers = await playerContract.cardNumbers(i);
      numbers.push(cardNumbers.toNumber());
    }
  } catch (error) {
    console.log("ancora non ho comprato la bingo card");
  }
  return numbers;
}

async function callBingo() {
  try {
    const tx = await playerContract.callBingo();
    const receipt = await tx.wait();
    const name = await getLogs(receipt);
    return Promise.resolve(name !== undefined);
  } catch (error) {
    console.log("cannot call bingo", error);
    return Promise.reject(error);
  }
}

async function withdraw() {
  const tx = await playerContract.withdraw();
  await tx.wait();
  return Promise.resolve();
}

async function getLogs(receipt) {
  let abi = ["event Bingo(string name)"];
  let logsInterface = new ethers.utils.Interface(abi);
  for (const element of receipt.logs) {
    try {
      let log = logsInterface.parseLog(element);
      const { name } = log.args;
      return name;
    } catch (error) {
      console.log("cannot parse logs", error);
    }
  }
}

window.dapp = {
  buyBingoCard,
  isConnected,
  callBingo,
  login,
  withdraw,
};
