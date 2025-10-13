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

// ---------------- Navigation ----------------
for (let link of links) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const href = this.getAttribute("href");
    loadContent(href);

    history.pushState({ page: href }, "", href);
  });
}

// ---------------- Load Content ----------------
function loadContent(url) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "document";
  xhr.onload = function() {
    if (xhr.status === 200 && xhr.response) {
      const newMain = xhr.response.querySelector("main");
      if (newMain) {
        output.replaceChildren(...newMain.childNodes);

        // Wenn Teile-Seite geladen -> JSON-Daten laden
        if (url.includes("parts.html")) {
          loadParts();
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

// ---------------- Load Parts ----------------
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
        container.appendChild(card);
      });
    } else {
      console.error("Fehler beim Laden der Teile.");
    }
  };
  xhr.send();
}

// ---------------- Back-Button ----------------
window.addEventListener("popstate", function(event) {
  if (event.state) {
    loadContent(event.state.page);
  } else {
    loadContent("home.html");
  }
});

// ---------------- Startinhalt ----------------
loadContent("home.html");
