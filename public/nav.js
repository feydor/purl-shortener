/**
 * javascript for nav elements of views/header
 */
(function () {
  "use strict";

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = document.getElementById("header");
  if (selectHeader) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 20) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    });
  }
})();
