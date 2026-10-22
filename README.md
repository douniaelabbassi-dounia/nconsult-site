# Site N-CONSULT SOLUTIONS — nconsultsolutions.com

Site vitrine statique (HTML/CSS/JS, sans framework), hébergé sur Cloudflare.

## Structure

```
site/
├── wrangler.jsonc          # Config Cloudflare Workers (assets statiques + domaines)
└── public/                 # ← tout ce qui est mis en ligne
    ├── index.html          # Accueil
    ├── a-propos.html       # À propos
    ├── conseil.html        # Prestations Conseil        (contenu PROVISOIRE)
    ├── formation.html      # Académie / catalogue (27 fiches, filtres + recherche)
    ├── accompagnement.html # Accompagnement individuel  (contenu PROVISOIRE)
    ├── contact.html        # Formulaire (ouvre la messagerie, pré-rempli)
    ├── 404.html
    ├── _headers            # En-têtes de sécurité / cache
    ├── robots.txt, sitemap.xml, favicon.png
    └── assets/
        ├── css/style.css   # Charte : #C8102E, Montserrat + Poppins
        ├── js/main.js
        ├── js/formations.js  # Données du catalogue (modifier ici pour ajouter une formation)
        └── img/logo.jpg
```

## Aperçu local

```bash
cd site
python3 -m http.server 8787 --directory public
# → http://localhost:8787
```

## Mise en ligne sur Cloudflare

### Option A — en ligne de commande (recommandé)

```bash
cd site
npx wrangler login      # une seule fois
npx wrangler deploy
```

`wrangler.jsonc` rattache automatiquement `nconsultsolutions.com` et `www.nconsultsolutions.com`
(le domaine doit être dans le même compte Cloudflare — c'est le cas puisqu'il a été acheté chez Cloudflare).

### Option B — depuis le tableau de bord (sans terminal)

1. Cloudflare → **Workers & Pages** → **Create** → onglet **Pages** → **Upload assets**.
2. Nom du projet : `nconsultsolutions`, glisser le dossier **`public/`**, puis **Deploy**.
3. Projet → **Custom domains** → ajouter `nconsultsolutions.com` puis `www.nconsultsolutions.com`.
   Les DNS sont créés automatiquement.

### Adresse e-mail contact@nconsultsolutions.com

Le site affiche `contact@nconsultsolutions.com`. Pour que cette adresse reçoive vraiment les messages :
Cloudflare → le domaine → **Email** → **Email Routing** → activer, puis créer une règle
`contact@` → transférer vers la boîte Gmail/Outlook du client (gratuit).

## À compléter avec le client

- [ ] Textes définitifs **Conseil** et **Accompagnement** (bandeau jaune « contenu provisoire » à retirer).
- [ ] **Logos des références** : déposer les fichiers dans `public/assets/img/clients/` et, dans chaque page,
      remplacer `<div class="client">Nom</div>` par `<div class="client"><img src="assets/img/clients/nom.png" alt="Nom"></div>`.
- [ ] Téléphone (`+212 X XX XX XX XX`), URL LinkedIn de la société (actuellement `linkedin.com`).
- [ ] Photos : portrait du fondateur (À propos), visuels mission/terrain, vignettes des posts LinkedIn.
- [ ] Logo en haute définition / vectoriel (SVG) — la version actuelle vient de la présentation d'identité.
- [ ] Durée des formations (affichée « à définir selon le niveau et le contexte »).
- [ ] Mentions légales / politique de confidentialité (formulaire = données personnelles, loi 09-08).
- [ ] Plus tard : formulaire envoyé côté serveur (Cloudflare Worker + service e-mail) au lieu d'ouvrir la messagerie.
