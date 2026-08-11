// Revelia Evolution — comportements partagés

document.addEventListener("DOMContentLoaded", () => {
  // Menu mobile
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Fermer un <details> quand un autre s'ouvre (accordéon FAQ)
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // Révélation au scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Année du footer
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Justifie "EVOLUTION" pour que son encre visible occupe exactement la
  // largeur encrée de "Revelia". On mesure l'encre réelle (pixels non
  // transparents) via un canvas plutôt que la largeur d'avance des
  // caractères : deux polices différentes n'ont pas la même "graisse de
  // fin de caractère", donc une correspondance de largeur d'avance ne
  // garantit pas un alignement visuel du bord droit.
  const inkMeasureCanvas = document.createElement("canvas");
  const inkMeasureCtx = inkMeasureCanvas.getContext("2d");
  const measureInk = (text, font) => {
    inkMeasureCtx.font = font;
    const advance = inkMeasureCtx.measureText(text).width;
    const pad = 20;
    inkMeasureCanvas.width = Math.ceil(advance) + pad * 2;
    inkMeasureCanvas.height = 200;
    inkMeasureCtx.font = font;
    inkMeasureCtx.textBaseline = "alphabetic";
    inkMeasureCtx.fillStyle = "#000";
    inkMeasureCtx.clearRect(0, 0, inkMeasureCanvas.width, inkMeasureCanvas.height);
    inkMeasureCtx.fillText(text, pad, 120);
    const { data, width, height } = inkMeasureCtx.getImageData(0, 0, inkMeasureCanvas.width, inkMeasureCanvas.height);
    let minX = Infinity, maxX = -Infinity;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * 4 + 3] > 10) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
      }
    }
    if (maxX < minX) return { left: 0, right: advance, advance };
    return { left: minX - pad, right: maxX - pad, advance };
  };

  const justifyLogoText = () => {
    document.querySelectorAll(".logo-text").forEach((wrap) => {
      const word = wrap.querySelector("strong");
      const sub = wrap.querySelector("span");
      if (!word || !sub) return;

      const wordStyle = getComputedStyle(word);
      const subStyle = getComputedStyle(sub);
      const wordFont = `${wordStyle.fontWeight} ${wordStyle.fontSize} ${wordStyle.fontFamily}`;
      const subFont = `${subStyle.fontWeight} ${subStyle.fontSize} ${subStyle.fontFamily}`;

      // measureInk() ne connaît que la police, pas le letter-spacing CSS de "Revelia"
      // (assets/css/style.css) : sans correction, le bord droit mesuré est plus étroit
      // que le rendu réel, et il reste un espace visible après "EVOLUTION".
      const wordLetterSpacing = parseFloat(wordStyle.letterSpacing) || 0;
      const wordChars = word.textContent.trim().length;
      const targetInk = measureInk(word.textContent, wordFont).right + Math.max(wordChars - 1, 0) * wordLetterSpacing;
      sub.style.letterSpacing = "0px";
      const naturalInk = measureInk(sub.textContent, subFont);
      const chars = sub.textContent.trim().length;

      if (chars > 1 && targetInk > naturalInk.right) {
        // L'espacement ajouté après le tout dernier caractère élargit la boîte
        // du texte mais ne déplace pas son encre visible : seuls les (chars-1)
        // intervalles entre caractères déterminent la position du bord droit visible.
        const spacing = (targetInk - naturalInk.right) / (chars - 1);
        sub.style.letterSpacing = spacing + "px";
      }
    });
  };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(justifyLogoText);
  } else {
    justifyLogoText();
  }
  window.addEventListener("resize", justifyLogoText);

  // Formulaire de contact (Web3Forms)
  const form = document.querySelector("#contact-form");
  if (form) {
    const statusEl = form.querySelector(".form-status");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi en cours…";
      statusEl.textContent = "";
      statusEl.className = "form-status";

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        const result = await response.json();
        if (result.success) {
          statusEl.textContent = "Message envoyé avec succès. Nous revenons vers vous très vite !";
          statusEl.classList.add("ok");
          form.reset();
        } else {
          throw new Error(result.message || "Erreur inconnue");
        }
      } catch (err) {
        statusEl.textContent =
          "L'envoi a échoué. Merci de nous contacter directement par téléphone ou par email.";
        statusEl.classList.add("err");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }
});
