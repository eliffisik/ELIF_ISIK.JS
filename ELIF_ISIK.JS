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
      .elif-carousel-title{  font-family: "Quicksand-SemiBold", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.22;
  color: #2b2f33;
  margin: 0;}
      .elif-carousel{display:flex; gap:16px; padding:16px 20px 24px; overflow-x:auto; scroll-snap-type:x mandatory; background:#fff; border-radius:12px; box-shadow:0 8px 20px rgba(0,0,0,.05); margin:10px 0}
      .elif-card{flex:0 0 auto; min-width:200px; max-width:220px; border:1px solid #eee; border-radius:10px; padding:10px; position:relative; background:#fff; scroll-snap-align:start}
      .elif-img{width:100%; border-radius:6px; cursor:pointer}
     .elif-name {
  font: 400 12px/1.45 "Quicksand-Medium", sans-serif;
  margin: 8px 0;
  color: #2b2f33;
  min-height: 42px;
}
.elif-name strong {
  font-weight: 700;
}
      .elif-price {
  font-family: "Quicksand-SemiBold", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #2b2f33;
  margin-top: 6px;
}

.elif-price strong {
  color: #00a365; 
  font-weight: 700;
}

.elif-price del {
  color: #999;
  margin-right: 6px;
  font-size: 14px;
}

.elif-disc {
  display: inline-block;
  background: #e6f5e6;
  color: #00a365;
  font-size: 13px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 6px;
  margin-left: 6px;
  vertical-align: middle;
}

     .elif-heart {
  position: absolute;
  top: 15px;
  right: 10px;
  width: 17px;
  height: 17px;
  cursor: pointer;
  background: url("data:image/svg+xml;utf8,<svg fill='none' stroke='%23999' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>") no-repeat center/contain;
  transition: filter 0.3s;
}

.elif-heart:hover {
  filter: invert(48%) sepia(98%) saturate(1440%) hue-rotate(2deg) brightness(103%) contrast(100%);
}

.elif-heart.active {
  background: url("data:image/svg+xml;utf8,<svg fill='%23FF6A00' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>") no-repeat center/contain;
}
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
      name.innerHTML = `
  <strong>${p.brand || ""}</strong> - ${p.name}
`;

      const price = document.createElement("div");
price.className = "elif-price";

if (p.price < p.original_price) {
  const discountPercent = Math.round(
    (1 - p.price / p.original_price) * 100
  );
  price.innerHTML =
    `<del>${p.original_price.toFixed(2)} TL</del>` +
    `<strong>${p.price.toFixed(2)} TL</strong>` +
    `<span class="elif-disc">%${discountPercent}</span>`;
} else {
  price.innerHTML = `<span>${p.price.toFixed(2)} TL</span>`;
}


      const heart = document.createElement("span");
      heart.className = "elif-heart" + (favs.includes(p.id) ? " active" : "");
      heart.onclick = () => {
        const updated = toggleFavorite(p.id);
        heart.classList.toggle("active", updated.includes(p.id));
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
    await sleep(1000); // waiting for DOM to be ready
    const products = await loadProducts();
    const { title, wrap } = buildCarousel(products);
    const wrapper = document.createElement("div");
    wrapper.appendChild(title);
    wrapper.appendChild(wrap);

    const refHeading = [...document.querySelectorAll("h2")].find(
      (el) =>
        el.textContent?.trim().toLowerCase() ===
        "sizin için seçtiklerimiz".toLowerCase()
    );

    if (refHeading) {
      const container =
        refHeading.closest("section") || refHeading.parentElement;
      container?.parentElement?.insertBefore(wrapper, container);
    } else {
      document.body.prepend(wrapper);
    }
  })();
})();
