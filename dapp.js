async function isConnected() {
    return Promise.resolve(false);
  }
  
  async function login() {
    return Promise.resolve("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199")
  }
  
  async function buyBingoCard() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          numbers: [3, 23, 12, 34, 9, 1],
        });
      }, 1000);
    });
  }
  
  async function collect() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(resolve(Math.random() > .5));
      }, 1000);
    });
  }
  
  window.dapp = {
    buyBingoCard,
    isConnected,
    collect,
    login,
  };
  