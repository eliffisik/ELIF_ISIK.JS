(function () {
  const LOCAL_STORAGE_KEY = "carousel_products";
  const FAVORITES_KEY = "favorite_product_ids";
  if (location.pathname !== "/") {
    console.log("wrong page");
    return;
  }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  async function loadProducts() {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) return JSON.parse(cached);
    const res = await fetch(
      "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json"
    );
    const data = await res.json();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    return data;
  }

  function getFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  }

  function toggleFavorite(id) {
    const favs = getFavorites();
    const i = favs.indexOf(id);
    i === -1 ? favs.push(id) : favs.splice(i, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    return favs;
  }

function buildCarousel(products) {
    const favs = getFavorites();

    const style = document.createElement("style");
    style.textContent = `
      .elif-carousel-title{font:600 20px/1.3 system-ui; margin:20px 20px 0}
      .elif-carousel{display:flex; gap:16px; padding:16px 20px 24px; overflow-x:auto; scroll-snap-type:x mandatory; background:#fff; border-radius:12px; box-shadow:0 8px 20px rgba(0,0,0,.05); margin:10px 0}
      .elif-card{flex:0 0 auto; min-width:200px; max-width:220px; border:1px solid #eee; border-radius:10px; padding:10px; position:relative; background:#fff; scroll-snap-align:start}
      .elif-img{width:100%; border-radius:6px; cursor:pointer}
      .elif-name{font:500 14px/1.35 system-ui; margin:8px 0; min-height:40px}
      .elif-price{font:600 14px/1.2 system-ui}
      .elif-price del{color:#999; margin-left:8px}
      .elif-disc{color:#e53935; margin-left:8px; font-weight:700}
      .elif-heart{position:absolute; top:10px; right:10px; cursor:pointer; font-size:18px}
      @media (max-width:500px){.elif-card{min-width:65vw}}
    `;
    document.head.appendChild(style);

    const title = document.createElement("h2");
    title.className = "elif-carousel-title";
    title.textContent = "Beğenebileceğinizi düşündüklerimiz";

    const wrap = document.createElement("section");
    wrap.className = "elif-carousel";

    products.forEach((p) => {
      const card = document.createElement("div");
      card.className = "elif-card";

      const img = document.createElement("img");
      img.className = "elif-img";
      img.src = p.img;
      img.alt = p.name;
      img.onclick = () => window.open(p.url, "_blank");

      const name = document.createElement("p");
      name.className = "elif-name";
      name.textContent = p.name;

      const price = document.createElement("div");
      price.className = "elif-price";
      if (p.price !== p.original_price) {
        const discountPercent = Math.round((1 - p.price / p.original_price) * 100);
        price.innerHTML =
          `<strong>${p.price.toFixed(2)} TL</strong>` +
          `<del>${p.original_price.toFixed(2)} TL</del>` +
          `<span class="elif-disc">-${discountPercent}%</span>`;
      } else {
        price.innerHTML = `<strong>${p.price.toFixed(2)} TL</strong>`;
      }

      const heart = document.createElement("span");
      heart.className = "elif-heart";
      heart.innerHTML = favs.includes(p.id) ? "🧡" : "🤍";
      heart.onclick = () => {
        const updated = toggleFavorite(p.id);
        heart.innerHTML = updated.includes(p.id) ? "🧡" : "🤍";
      };

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(price);
      card.appendChild(heart);
      wrap.appendChild(card);
    });

    return { title, wrap };
  }

   (async () => {
  const products = await loadProducts();
  const { title, wrap } = buildCarousel(products);
  await sleep(1000); // waiting for DOM to be ready
   const refHeading = [...document.querySelectorAll("h2")].find(
      (el) =>
        el.textContent?.trim().toLowerCase() ===
        "sizin için seçtiklerimiz".toLowerCase()
    );

    
    if (refHeading) {
      const container = refHeading.closest("section") || refHeading.parentElement;
      container?.parentElement?.insertBefore(wrapper, container);
    }
   })();


})();
