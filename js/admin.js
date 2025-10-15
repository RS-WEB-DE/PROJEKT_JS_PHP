"use strict";
console.log("Admin-Script läuft!");

const tableBody = document.querySelector("#partsTable tbody");
const message = document.querySelector("#message");
const form = document.querySelector("#partForm");


function loadParts() {
  fetch("api/getParts.php")
    .then(res => res.json())
    .then(parts => {
      tableBody.innerHTML = "";
      parts.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.price} €</td>
          <td><img src="${p.img}" width="50"></td>
          <td>
            <button class="edit" data-id="${p.id}">Bearbeite</button>
            <button class="delete" data-id="${p.id}">Löschen</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    })
    .catch(() => (message.textContent = "Fehler beim Laden der Daten."));
}

loadParts(); 

tableBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    const id = e.target.dataset.id;
    if (confirm("Wirklich löschen?")) {
      fetch("api/deletePart.php", {
        method: "POST",
        body: new URLSearchParams({ id }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            message.textContent = "Teil gelöscht!";
            loadParts();
          } else {
            message.textContent = "Fehler beim Löschen!";
          }
        });
    }
  }
});

tableBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit")) {
    const row = e.target.closest("tr");
    document.querySelector("#partId").value = row.children[0].textContent;
    document.querySelector("#partName").value = row.children[1].textContent;
    document.querySelector("#partPrice").value = parseFloat(row.children[2].textContent);
    document.querySelector("#partImg").value = row.querySelector("img").src;
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = form.partId.value.trim();
  const name = form.partName.value.trim();
  const price = form.partPrice.value.trim();
  const img = form.partImg.value.trim();

  const url = id ? "api/updatePart.php" : "api/addPart.php";
  const data = new URLSearchParams({ id, name, price, img });

  fetch(url, { method: "POST", body: data })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        message.textContent = id ? "Teil aktualisiert!" : "Teil hinzugefügt!";
        form.reset();
        loadParts();
      } else {
        message.textContent = "Fehler beim Speichern!";
      }
    });
});
