"use strict";
/* 
const output = document.querySelector("#main-content");
const links = document.querySelectorAll("nav a");
const href = "parts.html";

for (let link of links) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const href = this.getAttribute("href");
    loadContent(href);

    
    history.pushState({ page: href }, "", href);
  });
}

function loadContent(url) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "document";
  xhr.onload = function() {
    if (xhr.status === 200) {
      const newMain = xhr.response.querySelector("main");
      output.replaceChildren(...newMain.childNodes);
    } else {
      output.textContent = "Fehler beim Laden.";
    }
  };
  xhr.send();
}

// Back-Button-Handling
window.addEventListener("popstate", function(event) {
  if (event.state) {
    loadContent(event.state.page);
  } else {
    loadContent("home.html");
  }
});

// Startinhalt laden
loadContent("home.html");
 */

"use strict";

const output = document.querySelector("#main-content");
const links = document.querySelectorAll("nav a");

for (let link of links) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const href = this.getAttribute("href");
    loadContent(href);

    history.pushState({ page: href }, "", href);
  });
}

function loadContent(url) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "document";
  xhr.onload = function() {
    if (xhr.status === 200 && xhr.response) {
      const newMain = xhr.response.querySelector("main");
      if (newMain) {
        output.replaceChildren(...newMain.childNodes);

        if (url.includes("parts.html")) {
          loadParts();
        } else if (url.includes("cart.html")) {
  // kleine Verzögerung / sicherstellen, dass DOM eingefügt ist
  setTimeout(renderCart, 0);
}

      } else {
        output.textContent = "Keine <main>-Inhalte gefunden!";
      }
    } else {
      output.textContent = "Fehler beim Laden.";
    }
  };
  xhr.send();
}

function loadParts() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "data/parts.json");
  xhr.responseType = "json";
  xhr.onload = function() {
    if (xhr.status === 200 && xhr.response) {
      const parts = xhr.response;
      const container = document.querySelector("#parts-list");
      container.innerHTML = "";

      parts.forEach(part => {
        const card = document.createElement("div");
        card.classList.add("part-card");
        card.innerHTML = `
          <img src="${part.img}" alt="${part.name}">
          <h3>${part.name}</h3>
          <p>${part.price} €</p>
          <button data-id="${part.id}">Hinzufügen</button>
        `;

        const button = card.querySelector("button");
  button.addEventListener("click", function() {
    const cart = getCart();
    // prüfen, ob Teil schon vorhanden
    if (!cart.find(item => item.id === part.id)) {
      cart.push(part);
      saveCart(cart);
      updateCartCount();
      alert(`${part.name} wurde hinzugefügt!`);
    } else {
      alert(`${part.name} ist schon im Warenkorb.`);
    }
  });

        container.appendChild(card);
      });
    } else {
      console.error("Fehler beim Laden der Teile.");
    }
  };
  xhr.send();
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
const countEl = document.querySelector("#cart-count");
  if (countEl) countEl.textContent = cart.length;
}

function renderCart() {
  const cart = getCart();
  const list = document.querySelector("#cart-list");
  const totalEl = document.querySelector("#cart-total");
  const clearBtn = document.querySelector("#clear-cart");
  const checkoutBtn = document.querySelector("#checkout");

  if (!list || !totalEl) return; 

 
  list.innerHTML = "";

  // 2) Wenn leer -> Hinweis anzeigen
  if (cart.length === 0) {
    const p = document.createElement("p");
    p.textContent = "Dein Warenkorb ist leer.";
    list.appendChild(p);
    totalEl.textContent = "Gesamt: 0 €";
    // Buttons deaktivieren
    clearBtn.disabled = true;
    checkoutBtn.disabled = true;
    return;
  }

  // 3) Sonst: Artikel einfügen und Summe berechnen
  let total = 0;
  cart.forEach(item => {
    total += Number(item.price);

    const li = document.createElement("li");
    li.classList.add("cart-item");
    li.dataset.id = item.id; // id im DOM merken

    // Baue sauberes DOM (kein innerHTML nötig, aber übersichtlicher)
    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.name;
    img.style.width = "60px";
    img.style.height = "60px";
    img.style.objectFit = "cover";
    img.style.marginRight = "0.5rem";

    const info = document.createElement("div");
    info.style.display = "inline-block";
    info.style.verticalAlign = "top";

    const name = document.createElement("div");
    name.textContent = item.name;

    const price = document.createElement("div");
    price.textContent = item.price + " €";

    info.appendChild(name);
    info.appendChild(price);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Entfernen";
    removeBtn.style.marginLeft = "1rem";
    removeBtn.addEventListener("click", function() {
      removeFromCart(item.id);
    });

    li.appendChild(img);
    li.appendChild(info);
    li.appendChild(removeBtn);

    list.appendChild(li);
  });

  totalEl.textContent = "Gesamt: " + total + " €";

  // Buttons aktivieren
  clearBtn.disabled = false;
  checkoutBtn.disabled = false;
}

// --- Entfernt ein Item nach ID ---
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  updateCartCount();

  // Wenn wir gerade auf der cart.html sind: neu rendern
  const list = document.querySelector("#cart-list");
  if (list) renderCart();
}

// --- Alles entfernen ---
function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
  const list = document.querySelector("#cart-list");
  if (list) renderCart();
}

// --- Checkout Simulation ---
function checkout() {
  // einfache Demo: clear cart + Meldung
  alert("Vielen Dank für deinen Einkauf! (Dies ist nur ein Demo-Checkout.)");
  clearCart();
  // optional: redirect to confirmation page
}



window.addEventListener("popstate", function(event) {
  if (event.state) { //aus push state
    loadContent(event.state.page);
  } else {
    loadContent("home.html");
  }
});

loadContent("home.html");//mein Anfang starten
updateCartCount();
renderCart();