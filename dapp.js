async function isConnected() {
  if(typeof window.ethereum === "undefined") {
    throw new Error("please install metamask");
  }
  return Promise.resolve(window.ethereum.isConnected());
}

async function login() {
  return window.ethereum.request(
    {method: "eth_requestAccounts"}
  ).then((account) => {
    return account[0];
  })
}

async function buyBingoCard() {

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        numbers: [3, 23, 12, 34, 9, 1],
      });
    }, 1000);
  });
}

async function callBingo() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(resolve(Math.random() > 0.5));
    }, 1000);
  });
}

async function withdraw() {
  return Promise.resolve();
}

window.dapp = {
  buyBingoCard,
  isConnected,
  callBingo,
  login,
  withdraw
};
