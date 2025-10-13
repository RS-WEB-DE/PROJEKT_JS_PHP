"use strict";

// ------------------------------------------------------------
// 1. Elemente holen
// ------------------------------------------------------------
const output = document.querySelector("#main-content");
const links = document.querySelectorAll("nav a");

// ------------------------------------------------------------
// 2. Navigation: Seiten per AJAX laden
// ------------------------------------------------------------
for (let link of links) {
  link.addEventListener("click", function (event) {
    event.preventDefault(); // Seite lädt nicht neu
    const href = this.getAttribute("href"); // z. B. "parts.html"
    loadContent(href);

    // Verlauf speichern (Back-Button funktioniert)
    history.pushState({ page: href }, "", href);
  });
}

// ------------------------------------------------------------
// 3. Funktion: Seite per AJAX laden
// ------------------------------------------------------------
function loadContent(url) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "document"; // Ganze HTML-Datei als Dokument holen

  xhr.onload = function () {
    if (xhr.status === 200 && xhr.response) {
      // neues <main> aus der geladenen Datei nehmen
      const newMain = xhr.response.querySelector("main");
      // altes <main> ersetzen
      output.replaceChildren(...newMain.childNodes);

      // Prüfen, welche Seite geladen wurde
      if (url.includes("parts.html")) {
        loadParts(); // Produkte anzeigen
      } else if (url.includes("cart.html")) {
        setTimeout(renderCart, 0); // Warenkorb anzeigen
      }
    } else {
      output.textContent = "Fehler beim Laden der Seite.";
    }
  };

  xhr.send();
}

// ------------------------------------------------------------
// 4. Wenn der Benutzer den Zurück-Button klickt
// ------------------------------------------------------------
window.addEventListener("popstate", function (event) {
  if (event.state) {
    loadContent(event.state.page);
  } else {
    loadContent("home.html");
  }
});

// ------------------------------------------------------------
// 5. Produkte laden (parts.json)
// ------------------------------------------------------------
function loadParts() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "data/parts.json");
  xhr.responseType = "json";
  xhr.onload = function () {
    if (xhr.status === 200) {
      const parts = xhr.response;
      const container = document.querySelector("#parts-list");

      // Inhalt leeren
      container.innerHTML = "";

      parts.forEach(part => {
        // Produktkarte
        const card = document.createElement("div");
        card.classList.add("part-card");
        card.innerHTML = `
          <img src="${part.img}" alt="${part.name}">
          <h3>${part.name}</h3>
          <p>${part.price} €</p>
          <button data-id="${part.id}">Hinzufügen</button>
        `;

        // Klick auf "Hinzufügen"
        const button = card.querySelector("button");
        button.addEventListener("click", function () {
          const cart = getCart();
          const alreadyInCart = cart.find(item => item.id === part.id);

          if (!alreadyInCart) {
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
      console.error("Fehler beim Laden von parts.json");
    }
  };
  xhr.send();
}

// ------------------------------------------------------------
// 6. Warenkorb-Funktionen (localStorage)
// ------------------------------------------------------------
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  // speichert Array als Text
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  // zeigt Anzahl oben rechts an
  const cart = getCart();
  const countEl = document.querySelector("#cart-count");
  if (countEl) countEl.textContent = cart.length;
}

// ------------------------------------------------------------
// 7. Warenkorb-Seite aufbauen
// ------------------------------------------------------------
function renderCart() {
  const cart = getCart();
  const list = document.querySelector("#cart-list");
  const totalEl = document.querySelector("#cart-total");
  const clearBtn = document.querySelector("#clear-cart");
  const checkoutBtn = document.querySelector("#checkout");

  if (!list || !totalEl) return;

  // 1. Alles löschen
  list.innerHTML = "";

  // 2. Wenn leer
  if (cart.length === 0) {
    list.innerHTML = "<p>Dein Warenkorb ist leer.</p>";
    totalEl.textContent = "Gesamt: 0 €";
    clearBtn.disabled = true;
    checkoutBtn.disabled = true;
    return;
  }

  // 3. Produkte anzeigen
  let total = 0;
  cart.forEach(item => {
    total += Number(item.price);

    const li = document.createElement("li");
    li.classList.add("cart-item");
    li.innerHTML = `
      <img src="${item.img}" alt="${item.name}" width="60">
      <span>${item.name}</span> - <strong>${item.price} €</strong>
      <button>Entfernen</button>
    `;

    const removeBtn = li.querySelector("button");
    removeBtn.addEventListener("click", function () {
      removeFromCart(item.id);
    });

    list.appendChild(li);
  });

  totalEl.textContent = `Gesamt: ${total} €`;

  clearBtn.disabled = false;
  checkoutBtn.disabled = false;


  clearBtn.onclick = clearCart;
  checkoutBtn.onclick = checkout;
}


function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  updateCartCount();
  renderCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
  renderCart();
}

function checkout() {
  alert("Vielen Dank für deinen Einkauf! (Demo)");
  clearCart();
}

loadContent("home.html");
updateCartCount();

/**
 * Bereich	Was passiert
loadContent()	Lädt eine HTML-Datei mit AJAX und ersetzt das <main> deiner Seite.
loadParts()	Wird aufgerufen, wenn du „Teile“ öffnest. Liest parts.json, baut DOM-Karten, hängt Klicks dran.
Klick auf „Hinzufügen“	Speichert das Produkt im localStorage.
getCart() / saveCart()	Lesen und Schreiben des Warenkorbs im Browser-Speicher.
renderCart()	Baut die Liste im Warenkorb auf (cart.html) neu auf, mit Bildern, Preisen, Buttons.
removeFromCart()	Löscht einen Artikel aus dem Warenkorb.
updateCartCount()	Zeigt, wie viele Produkte im Warenkorb sind (in der Ecke oben).
checkout()	Nur eine Demo-Nachricht und leert danach den Warenkorb.
 */