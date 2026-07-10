(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealItems = document.querySelectorAll("[data-reveal]");

  if (!revealItems.length) return;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach(function (el) {
      observer.observe(el);
    });
  }

  var header = document.querySelector(".site-header");
  if (header) {
    var setScrolled = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });
  }

  var leakTabs = Array.prototype.slice.call(document.querySelectorAll(".leak-tab"));
  var leakViews = Array.prototype.slice.call(document.querySelectorAll(".leak-view"));

  if (leakTabs.length && leakTabs.length === leakViews.length) {
    var selectLeakTab = function (index) {
      leakTabs.forEach(function (tab, i) {
        var active = i === index;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.tabIndex = active ? 0 : -1;
        leakViews[i].classList.toggle("is-active", active);
        leakViews[i].hidden = !active;
      });
    };

    leakTabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        selectLeakTab(i);
      });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % leakTabs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i - 1 + leakTabs.length) % leakTabs.length;
        if (next !== null) {
          event.preventDefault();
          selectLeakTab(next);
          leakTabs[next].focus();
        }
      });
    });

    var activeLeakIndex = function () {
      for (var i = 0; i < leakTabs.length; i++) {
        if (leakTabs[i].classList.contains("is-active")) return i;
      }
      return 0;
    };

    var prevArrow = document.querySelector(".leak-arrow.prev");
    var nextArrow = document.querySelector(".leak-arrow.next");

    if (prevArrow && nextArrow) {
      prevArrow.addEventListener("click", function () {
        selectLeakTab((activeLeakIndex() - 1 + leakTabs.length) % leakTabs.length);
      });
      nextArrow.addEventListener("click", function () {
        selectLeakTab((activeLeakIndex() + 1) % leakTabs.length);
      });
    }

    selectLeakTab(0);
  }
})();
