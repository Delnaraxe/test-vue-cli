11. Procédure recommandée
ETAPE 1 — Installer NGINX
sudo apt install nginx
ETAPE 2 — Vérifier service
systemctl status nginx
ETAPE 3 — Identifier tes applications

Exemple :

Application	Port
SPA principale	8080
SPA admin	8081
Express API	3000
ETAPE 4 — Créer configuration NGINX

Créer :

sudo nano /etc/nginx/sites-available/mw2web
ETAPE 5 — Configurer reverse proxy

Exemple :

server {

	listen 80;

	server_name localhost;

	location / {
		proxy_pass http://localhost:8080;
	}

	location /admin/ {
		proxy_pass http://localhost:8081;
	}

	location /api/ {
		proxy_pass http://localhost:3000/;
	}
}
12. Explication importante
location /

SPA principale.

location /admin/

Deuxième SPA.

location /api/

Backend Express.

13. Pourquoi cette architecture est bonne

Le navigateur voit :

une seule origin

Donc :

plus de CORS
URLs propres
architecture centralisée
14. ETAPE 6 — Activer le site
sudo ln -s /etc/nginx/sites-available/mw2web \
/etc/nginx/sites-enabled/
ETAPE 7 — Tester config

Très important :

sudo nginx -t
ETAPE 8 — Redémarrer NGINX
sudo systemctl restart nginx
15. Adapter Axios

Avant :

baseURL: 'http://localhost:3000'

Après :

baseURL: '/api'

Très important.

16. Pourquoi /api

NGINX :

reçoit /api/...
redirige vers Express

Le frontend :

ignore complètement le vrai port backend

Très bonne architecture.

17. Important pour les SPA Vue

Vue Router history mode nécessite :

try_files $uri /index.html;

Sinon :

refresh F5 casse les routes

Important plus tard.

18. Architecture industrielle recommandée

Plus tard :

NGINX
 ├── sert fichiers Vue buildés
 ├── proxy API Express
 ├── HTTPS
 ├── logs
 └── sécurité

Très standard.

19. Pourquoi c’est très pertinent pour ton projet robotique

Tu vas apprendre :

architecture web réelle
reverse proxy
isolation services
gestion réseau
déploiement industriel
sécurité HTTP

Très utile dans :

supervision industrielle
applications critiques
IHM robots

Sources :

NGINX Reverse Proxy Documentation
NGINX Beginner Guide
Vue Router History Mode
Express Documentation