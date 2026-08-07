const navToggle = document.getElementById("nav-toggle");
navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";

  navToggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
});
