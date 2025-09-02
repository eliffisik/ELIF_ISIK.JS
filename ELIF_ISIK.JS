(function () {
  const LOCAL_STORAGE_KEY = "carousel_products";
  const FAVORITES_KEY = "favorite_product_ids";
  if (location.pathname !== "/") return;

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
      .elif-carousel-title {
        font-family: "Quicksand-SemiBold", sans-serif;
        font-size: 24px;
        font-weight: 700;
        line-height: 1.22;
        color: #2b2f33;
        margin: 0;
      }

      .elif-carousel {
        display: flex;
        gap: 16px;
        padding: 16px 45px 24px 20px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        margin: 10px 0;
        background: transparent !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }

      .elif-carousel::-webkit-scrollbar {
        display: none;
      }
      .elif-carousel {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .elif-card {
        flex: 0 0 auto;
        min-width: 20%;
        max-width: 20%;
        border: 1px solid #eee;
        border-radius: 10px;
        padding: 10px;
        position: relative;
        background: #fff;
        scroll-snap-align: start;
        padding-bottom: 70px;
        transition: border 0.2s ease-in-out;
      }

      @media (max-width: 1024px) {
        .elif-card {
          min-width: 33.3333%;
          max-width: 33.3333%;
        }
      }

      @media (max-width: 860px) {
        .elif-card {
          min-width: 50%;
          max-width: 50%;
        }
      }

      .elif-card:hover {
        border: 1px solid #ccc;
      }

      .elif-img {
        width: 100%;
        border-radius: 6px;
        cursor: pointer;
      }

      .elif-name {
        font: 400 12px/1.45 "Quicksand-Medium", sans-serif;
        margin: 8px 0;
        color: #2b2f33;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        min-height: calc(1.45em * 2);
      }

      .elif-name strong {
        font-weight: 700;
      }

      .elif-price {
        position: absolute;
        bottom: 10px;
        left: 10px;
        right: 10px;
        font-family: "Quicksand-SemiBold", sans-serif;
        font-weight: 700;
        font-size: 16px;
        color: #2b2f33;
        display: flex;
        flex-direction: column;
        gap: 4px;
        line-height: 1.2;
      }

      .elif-price del {
        margin-bottom: 0;
        text-decoration: none;
        color: #999;
        line-height: 1.1;
        display: inline-flex;
        align-items: center;
      }

      .elif-price .major {
        font-size: 18px;
        font-weight: 700;
      }

      .elif-price .minor {
        font-size: 13px;
        font-weight: 600;
        margin-left: 1px;
      }
          .elif-price .major_del {
  font-size: 12px;
  font-weight: 500;
  }
    .elif-price .minor_del {
    font-size: 12px;
    font-weight: 500;
  }


      .elif-price strong {
        color: #00a365;
        font-weight: 700;
      }

      .elif-disc {
        display: inline-block;
        background: #00a365;
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 16px;
        margin-left: 6px;
        vertical-align: middle;
      }

      .elif-heart {
        position: absolute;
        top: 15px;
        right: 10px;
        width: 15px;
        height: 17px;
        cursor: pointer;
        background: url("data:image/svg+xml;utf8,<svg fill='none' stroke='%23999' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>") no-repeat center/contain;
        transition: filter 0.3s;
      }

      .elif-heart.active {
        background: url("data:image/svg+xml;utf8,<svg fill='%23FF6A00' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>") no-repeat center/contain;
      }
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
      name.innerHTML = `<strong>${p.brand || ""}</strong> - ${p.name}`;

      const price = document.createElement("div");
      price.className = "elif-price";

      const priceMajor = Math.floor(p.price);
      const priceMinor = (p.price % 1).toFixed(2).substring(2);

      if (p.price < p.original_price) {
        const discountPercent = Math.round(
          (1 - p.price / p.original_price) * 100
        );
        const originalMajor = Math.floor(p.original_price);
        const originalMinor = (p.original_price % 1).toFixed(2).substring(2);
        price.innerHTML = `<div> <del><span class="major_del"><del>${originalMajor}</span><span class="minor_del">,${originalMinor} TL</span></del><span class="elif-disc">%${discountPercent}</span></div><div><strong><span class="major">${priceMajor}</span><span class="minor">,${priceMinor} TL</span></strong></div>`;
      } else {
        price.innerHTML = `<div><span><span class="major">${priceMajor}</span><span class="minor">,${priceMinor} TL</span></span></div>`;
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

    const leftArrow = document.createElement("button");
    leftArrow.style.cssText = `
      position: absolute;
      top: 50%;
      left: -55px;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background-color: #fff;
      background-image: url('https://cdn06.e-bebek.com/assets/toys/svg/arrow-left.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 14px 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      z-index: 10;
    `;
    leftArrow.onclick = () => wrap.scrollBy({ left: -250, behavior: "smooth" });

    const rightArrow = document.createElement("button");
    rightArrow.style.cssText = `
      position: absolute;
      top: 50%;
      right: -55px;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background-color: #fff;
      background-image: url('https://cdn06.e-bebek.com/assets/toys/svg/arrow-right.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 14px 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      z-index: 10;
    `;
    rightArrow.onclick = () => wrap.scrollBy({ left: 250, behavior: "smooth" });

    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.background = "transparent";
    container.style.boxShadow = "none";
    container.style.borderRadius = "0";
    container.appendChild(title);
    container.appendChild(leftArrow);
    container.appendChild(rightArrow);
    container.appendChild(wrap);

    return { wrap: container };
  }

  (async () => {
    await sleep(1000);
    const products = await loadProducts();
    const { wrap } = buildCarousel(products);

    const refHeading = [...document.querySelectorAll("h2")].find(
      (el) =>
        el.textContent?.trim().toLowerCase() === "sizin için seçtiklerimiz"
    );
    const container =
      refHeading?.closest("section") || refHeading?.parentElement;
    container?.parentElement?.insertBefore(wrap, container);
  })();
})();
