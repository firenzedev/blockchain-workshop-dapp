async function main() {
  const jsConfetti = new JSConfetti();
  const loginSection = document.getElementById("login");
  const controlsSection = document.getElementById("controls");
  const gameSection = document.getElementById("game");
  const lostSection = document.getElementById("lost");
  const loaderSection = document.getElementById("loader");
  const userSection = document.getElementById("user");
  const winnerSection = document.getElementById("winner");

  const loginButton = document.getElementById("login-button");
  const buyCardButton = document.getElementById("buy-card");
  const callBingoButton = document.getElementById("callbingo");
  const resetButton = document.getElementById("reset");
  const withdrawButton = document.getElementById("withdraw");

  const numbersElements = document.querySelectorAll(`[data-type="number"]`);
  const account = document.getElementById("account");
  const installMetamask = document.getElementById("install-metamask");

  //TODO sono connesso alla rete giusta?

  const NUMBERS_REQUIRED = 6;
  let numbersIHave = 0;

  function main() {
    dapp
      .isConnected()
      .then((yes) => {
        if (yes) {
          hide(loginSection);
          show(controlsSection);
        } else {
          show(loginButton);
          show(loginSection);
        }
      })
      .catch((err) => {
        console.log(err);
        show(installMetamask);
      })
      .finally(() => {
        hide(loader);
      });
  }

  main();

  function loginHandler() {
    dapp.login().then((user) => {
      if (user) {
        hide(loginSection);
        show(controlsSection);
        show(userSection);
        account.textContent = user;
      }
    });
  }

  function buyBingoCardHandler() {
    show(loaderSection);
    dapp
      .buyBingoCard()
      .then((card) => {
        const { numbers } = card;
        numbersElements.forEach((element, index) => {
          element.textContent = numbers[index];
        });
        hide(controlsSection);
        show(gameSection);
      })
      .finally(() => {
        hide(loaderSection);
      });
  }

  function numberClickedHandler(event) {
    const element = this;
    element.classList.add("is-success");
    launchConfetti();
    numbersIHave++;
    if (numbersIHave === NUMBERS_REQUIRED) {
      displayWinButton();
    }
  }

  function displayWinButton() {
    show(callBingoButton, { mode: "inline-block" });
  }

  function callBingoButtonHandler() {
    show(loaderSection);
    dapp
      .callBingo()
      .then((won) => {
        if (won) {
          launchConfetti(true);
          show(winnerSection);
          document.getElementById("dialog-default").showModal();
        } else {
          cheater();
        }
      })
      .finally(() => {
        hide(loaderSection);
      });
  }

  function withdrawListener() {
    dapp
      .withdraw()
      .then(() => {
        launchConfetti(true);
      })
      .catch((e) => {
        console.log("cannot withdraw", e);
      });
  }

  function reset() {
    numbersIHave = 0;
    hide(callBingoButton);
    hide(lostSection);
    numbersElements.forEach((element) => {
      element.classList.remove("is-success");
    });
  }

  function hide(element) {
    element.classList.remove("block");
    element.classList.remove("inline-block");
    element.classList.add("hidden");
  }

  function show(element, options = { mode: "block" }) {
    element.classList.remove("hidden");
    element.classList.add(options.mode);
  }

  function launchConfetti(big = false) {
    jsConfetti.addConfetti();
    if (big) {
      jsConfetti.addConfetti({
        emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
        confettiNumber: 100,
      });
    }
  }

  function cheater() {
    show(lostSection);
    document.getElementById("lost-dialog").showModal();
  }

  loginButton.addEventListener("click", loginHandler);
  buyCardButton.addEventListener("click", buyBingoCardHandler);
  numbersElements.forEach((element) =>
    element.addEventListener("click", numberClickedHandler)
  );
  callBingoButton.addEventListener("click", callBingoButtonHandler);
  resetButton.addEventListener("click", reset);
  withdrawButton.addEventListener("click", withdrawListener);
}

addEventListener("DOMContentLoaded", main);
