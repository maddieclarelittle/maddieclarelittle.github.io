(function () {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const links = document.querySelectorAll(".project-link");
  if (!links.length || !("IntersectionObserver" in window)) {
    links.forEach(function (link) {
      link.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
  );

  links.forEach(function (link, index) {
    link.style.transitionDelay = index * 80 + "ms";
    observer.observe(link);
  });
})();
