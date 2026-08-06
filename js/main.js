(function () {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const fadeTargets = document.querySelectorAll(".project-link, .art-gallery figure");
  if (fadeTargets.length) {
    if (!("IntersectionObserver" in window)) {
      fadeTargets.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
      );

      fadeTargets.forEach(function (el, index) {
        el.style.transitionDelay = (index % 9) * 70 + "ms";
        observer.observe(el);
      });
    }
  }

  initArtLightbox();

  function initArtLightbox() {
    const thumbs = Array.prototype.slice.call(
      document.querySelectorAll(".art-thumb")
    );
    if (!thumbs.length) {
      return;
    }

    const items = thumbs.map(function (thumb) {
      const figure = thumb.closest("figure");
      const caption = figure ? figure.querySelector("figcaption") : null;
      const img = thumb.querySelector("img");
      return {
        thumb: thumb,
        src: thumb.getAttribute("data-full") || (img && img.src) || "",
        alt: (img && img.getAttribute("alt")) || "",
        title: caption && caption.querySelector("strong")
          ? caption.querySelector("strong").textContent.trim()
          : "",
        detail: caption
          ? Array.prototype.filter
              .call(caption.childNodes, function (node) {
                return node.nodeType === 3 && node.textContent.trim();
              })
              .map(function (node) {
                return node.textContent.trim();
              })
              .join(" ")
          : "",
      };
    });

    const lightbox = document.createElement("div");
    lightbox.className = "art-lightbox";
    lightbox.setAttribute("hidden", "");
    lightbox.innerHTML =
      '<div class="art-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Artwork viewer">' +
      '<button type="button" class="art-lightbox-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="art-lightbox-nav prev" aria-label="Previous artwork">&larr;</button>' +
      '<div class="art-lightbox-frame"><img alt="" /></div>' +
      '<button type="button" class="art-lightbox-nav next" aria-label="Next artwork">&rarr;</button>' +
      '<p class="art-lightbox-caption"><strong></strong><span></span></p>' +
      "</div>";
    document.body.appendChild(lightbox);

    const image = lightbox.querySelector(".art-lightbox-frame img");
    const titleEl = lightbox.querySelector(".art-lightbox-caption strong");
    const detailEl = lightbox.querySelector(".art-lightbox-caption span");
    const closeBtn = lightbox.querySelector(".art-lightbox-close");
    const prevBtn = lightbox.querySelector(".art-lightbox-nav.prev");
    const nextBtn = lightbox.querySelector(".art-lightbox-nav.next");

    let index = 0;
    let lastFocus = null;

    function render() {
      const item = items[index];
      image.src = item.src;
      image.alt = item.alt;
      titleEl.textContent = item.title;
      detailEl.textContent = item.detail;
    }

    function open(i) {
      index = i;
      lastFocus = document.activeElement;
      render();
      lightbox.removeAttribute("hidden");
      requestAnimationFrame(function () {
        lightbox.classList.add("is-open");
      });
      document.body.classList.add("lightbox-open");
      closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      window.setTimeout(function () {
        lightbox.setAttribute("hidden", "");
        image.removeAttribute("src");
      }, 250);
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
    }

    function showPrev() {
      index = (index - 1 + items.length) % items.length;
      render();
    }

    function showNext() {
      index = (index + 1) % items.length;
      render();
    }

    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener("click", function () {
        open(i);
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", showPrev);
    nextBtn.addEventListener("click", showNext);

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        close();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("is-open")) {
        return;
      }
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowLeft") {
        showPrev();
      } else if (event.key === "ArrowRight") {
        showNext();
      }
    });
  }
})();
