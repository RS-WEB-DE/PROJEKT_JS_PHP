"use strict";


const output = document.querySelector("#main-content");
const links = document.querySelectorAll("nav a");


for (let link of links) {
  link.addEventListener("click", function (event) {
    event.preventDefault(); // Seite lädt nicht neu
    const href = this.getAttribute("href"); // z. B. "parts.html"
    loadContent(href);

    // history.pushState(stateObject, title, url);
    history.pushState({ page: href }, "WatchCraft Teile", href);
  });
}




function loadContent(url) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "document"; 

  xhr.onload = function () {
    if (xhr.status === 200 && xhr.response) {
      
      const newMain = xhr.response.querySelector("main");
     
      output.replaceChildren(...newMain.childNodes);

     
      if (url.includes("parts.html")) {
        loadParts(); 
      } else if (url.includes("cart.html")) {
        setTimeout(renderCart, 0); 
      }
    } else {
      output.textContent = "Fehler beim Laden der Seite.";
    }
  };

  xhr.send();
}

/* const footer = document.querySelector("#footerId");

const datenschutz = document.createElement("a");
datenschutz.textContent = "Datenschutz";
datenschutz.setAttribute("href", "datenschutz.html");

const impressum = document.createElement("a");
impressum.textContent = "Impressum";
impressum.setAttribute("href", "impressum.html");

footer.appendChild(datenschutz);
footer.appendChild(impressum);

datenschutz.addEventListener("click", handleFooterClick);
impressum.addEventListener("click", handleFooterClick);

function handleFooterClick(event) {
  const href = this.getAttribute("href");
  loadContent(href);
  history.pushState({ page: href }, "", href);
}
 */
function createFooterLink(text, href) {
  const link = document.createElement("a");
  link.textContent = text;
  link.setAttribute("href", href);

  link.addEventListener("click", function(event) {
   // event.preventDefault();
    loadContent(href);
    history.pushState({ page: href }, "", href);
  });

  return link;
}

const footer = document.querySelector("#footerId");
footer.append(
  createFooterLink("Datenschutz", "datenschutz.html"),
  createFooterLink("Impressum", "impressum.html")
);



window.addEventListener("popstate", function (event) {
  if (event.state) {
    loadContent(event.state.page);
  } else {
    loadContent("home.html");
  }
});


function loadParts() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "data/parts.json");
  xhr.responseType = "json";
  xhr.onload = function () {
    if (xhr.status === 200) {
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

 
  if (cart.length === 0) {
    list.innerHTML = "<p>Dein Warenkorb ist leer.</p>";
    totalEl.textContent = "Gesamt: 0 €";
    clearBtn.disabled = true;
    checkoutBtn.disabled = true;
    return;
  }


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