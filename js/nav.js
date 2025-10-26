document.addEventListener("DOMContentLoaded", () => {
  const openCollectionBtn = document.getElementById("openCollectionBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const backBtn = document.getElementById("backBtn");

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  }

  if (openCollectionBtn) {
    openCollectionBtn.addEventListener("click", () => {
      window.location.href = "./html/collection.html";
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      alert("Settings feature coming soon!");
    });
  }
});
