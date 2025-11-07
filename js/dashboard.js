document.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.getElementById("connectWalletBtn");
  const walletModal = document.getElementById("walletModal");
  const miningDashboard = document.getElementById("miningDashboard");
  const walletAddressField = document.getElementById("walletAddress");

  // Check if wallet is already connected
  const savedWallet = localStorage.getItem("walletAddress");
  if (savedWallet) {
    showMiningDashboard(savedWallet);
  } else {
    walletModal.style.display = "flex";
  }

  // Connect Wallet Button
  connectBtn.addEventListener("click", async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const resp = await window.solana.connect();
        const wallet = resp.publicKey.toString();
        localStorage.setItem("walletAddress", wallet);
        showMiningDashboard(wallet);
      } catch (err) {
        console.error("Wallet connection canceled:", err);
      }
    } else {
      alert("Please install the Phantom wallet to continue.");
      window.open("https://phantom.app/", "_blank");
    }
  });

  function showMiningDashboard(wallet) {
    walletModal.style.display = "none";
    miningDashboard.classList.remove("hidden");
    walletAddressField.textContent = wallet;
    startMiningSimulation();
  }

  function startMiningSimulation() {
    let rate = 5.0; // Example base rate
    let progress = 0;
    const progressFill = document.getElementById("progressFill");
    const claimBtn = document.getElementById("claimRewardsBtn");
    const timerDisplay = document.getElementById("roiTimer");
    const miningRateDisplay = document.getElementById("miningRate");

    miningRateDisplay.textContent = rate.toFixed(2);

    const timer = setInterval(() => {
      progress += 1;
      progressFill.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(timer);
        claimBtn.disabled = false;
      }
    }, 500); // simulate mining over time

    // ROI countdown (48 hours simulation)
    let hours = 48, minutes = 0, seconds = 0;
    const roiCountdown = setInterval(() => {
      if (hours === 0 && minutes === 0 && seconds === 0) {
        clearInterval(roiCountdown);
        return;
      }
      if (seconds === 0) {
        seconds = 59;
        if (minutes === 0) {
          minutes = 59;
          hours--;
        } else {
          minutes--;
        }
      } else {
        seconds--;
      }
      timerDisplay.textContent = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);
  }
});
