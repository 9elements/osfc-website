const hamburger = document.getElementById("hamburger");

hamburger?.addEventListener("click", () => {
  const isNavOpen = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", isNavOpen ? "false" : "true");
});
