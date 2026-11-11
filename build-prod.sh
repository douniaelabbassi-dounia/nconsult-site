#!/bin/sh
# Prépare dist/ pour Cloudflare : la maquette A seule, sans les maquettes B/C ni le bouton de bascule.
set -e
cd "$(dirname "$0")"
rm -rf dist
cp -R public dist
rm -rf dist/v2/css dist/v2/*.html dist/v3
# Les photos de la maquette B servent aussi à la maquette A : on garde dist/v2/img.
find dist -name '*.html' -exec sed -i '' '/<div class="switch">/d' {} +
echo "dist/ prêt"
