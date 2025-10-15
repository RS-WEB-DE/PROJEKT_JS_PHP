/watchcraft/
│
├── index.html
├── home.html
├── parts.html
├── custom.html
├── script.js
├── style.css
└── data/
    └── parts.json


watchcraft/
│
├── index.html
├── script.js
├── api/
│   ├── getParts.php     ← liefert JSON mit Uhrenteilen
│   └── saveOrder.php    ← nimmt Bestellung entgegen
├── db/
│   └── watchcraft.sql   ← dein Datenbankschema
└── data/
    └── ...


git remote add origin https://github.com/RS-WEB-DE/PROJEKT_JS_PHP.git