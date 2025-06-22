document.addEventListener("DOMContentLoaded", () => {
  // 🔍 Search Toggle Logic
  const toggle = document.getElementById("searchToggle");
  const input = document.getElementById("searchInput");

  toggle.addEventListener("click", () => {
    input.classList.toggle("active");
    input.focus();
  });

  // 📰 Trending News Slider using GNews API
  const API_KEY = "171c1b7d1024754cc2326404315eddbb";
  const wrapper = document.getElementById("sliderWrapper");
  const dotsContainer = document.getElementById("dots");
  let current = 0;
  let headlines = [];

  function goToSlide(index) {
    if (!headlines.length) return;
    wrapper.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll(".dot").forEach(dot => dot.classList.remove("active"));
    if (document.querySelectorAll(".dot")[index]) {
      document.querySelectorAll(".dot")[index].classList.add("active");
    }
    current = index;
  }

  async function fetchHeadlines() {
    try {
      const res = await fetch(
        `https://gnews.io/api/v4/top-headlines?topic=breaking&lang=en&country=in&max=5&token=${API_KEY}`
      );
      const data = await res.json();
      headlines = data.articles;

      wrapper.innerHTML = "";
      dotsContainer.innerHTML = "";

      headlines.forEach((article, index) => {
        const slide = document.createElement("div");
        slide.className = "slide";
        slide.innerHTML = `<p><strong>${article.title}</strong></p>`;
        wrapper.appendChild(slide);

        const dot = document.createElement("span");
        dot.className = "dot" + (index === 0 ? " active" : "");
        dot.dataset.index = index;
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });

      goToSlide(0);
    } catch (error) {
      console.error("❌ GNews API load failed:", error);
      wrapper.innerHTML = `<div class="slide"><p>Unable to load headlines.</p></div>`;
    }
  }

  document.querySelector(".slider-btn.right").addEventListener("click", () => {
    current = (current + 1) % headlines.length;
    goToSlide(current);
  });

  document.querySelector(".slider-btn.left").addEventListener("click", () => {
    current = (current - 1 + headlines.length) % headlines.length;
    goToSlide(current);
  });

  setInterval(() => {
    if (headlines.length) {
      current = (current + 1) % headlines.length;
      goToSlide(current);
    }
  }, 5000);

  fetchHeadlines();
});
