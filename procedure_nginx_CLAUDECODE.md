🚀 Installation complète NGINX - Reverse Proxy pour SPA Master + Slave

📋 Plan d'installation
1. Audit de l'existant (5 min)
2. Installation NGINX (10 min)
3. Configuration Master (15 min)
4. Configuration Slave (15 min)
5. Configuration NGINX (20 min)
6. Tests et validation (10 min)

🔍 Phase 1 : Audit de l'existant
Étape 1.1 : Identifier l'architecture actuelle
bash# Vérifier les processus Node en cours
ps aux | grep node

# Identifier les ports utilisés
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8080
sudo netstat -tlnp | grep :8081

# Vérifier la structure des projets
ls -la ~/Projects/  # ou ton dossier de projets
📝 Note les informations suivantes :
SPA Master :
- Chemin : /chemin/vers/master
- Port dev : _____ (probablement 8080)
- Backend port : _____ (probablement 3000)

SPA Slave :
- Chemin : /chemin/vers/slave
- Port dev : _____ (probablement 8081)

Étape 1.2 : Architecture cible
┌─────────────────────────────────────────────────┐
│  Navigateur (Client)                            │
└────────────────┬────────────────────────────────┘
                 │
                 │ Port 80 (HTTP) ou 443 (HTTPS)
                 ▼
┌─────────────────────────────────────────────────┐
│           NGINX Reverse Proxy                   │
│           Écoute sur :80                        │
│                                                 │
│  Routes configurées :                           │
│  ┌──────────────────────────────────────────┐  │
│  │ /              → Master SPA (8080)       │  │
│  │ /api/*         → Backend Express (3000)  │  │
│  │ /slave/*       → Slave SPA (8081)        │  │
│  └──────────────────────────────────────────┘  │
└────┬─────────────────┬──────────────────┬───────┘
     │                 │                  │
     │                 │                  │
┌────▼─────┐    ┌──────▼──────┐    ┌─────▼──────┐
│  Master  │    │   Backend   │    │   Slave    │
│  Vue SPA │    │   Express   │    │   Vue SPA  │
│  :8080   │    │   :3000     │    │   :8081    │
└──────────┘    └─────────────┘    └────────────┘
🎯 Argument du choix :

Path-based routing (/, /api, /slave) plutôt que sous-domaines

✅ Pas besoin de gérer DNS
✅ Même certificat SSL pour tout
✅ Pas de problème CORS entre apps
✅ Configuration plus simple




🔧 Phase 2 : Installation NGINX
Étape 2.1 : Installation du package
bash# Mettre à jour les dépôts
sudo apt update
# Commande : apt = Advanced Package Tool (gestionnaire de paquets Debian/Ubuntu)
# Argument : update = télécharge la liste des paquets disponibles
# sudo = exécute avec privilèges root (nécessaire pour modifier le système)

# Installer NGINX
sudo apt install nginx -y
# Argument : install = installe le paquet spécifié
# Argument : -y = répond automatiquement "oui" aux confirmations
# nginx = paquet du serveur web NGINX

# Vérifier la version installée
nginx -v
# Attendu : nginx version: nginx/1.18.0 (ou supérieur)
📍 Emplacement installation :
/usr/sbin/nginx          → Binaire exécutable
/etc/nginx/              → Fichiers de configuration
/var/log/nginx/          → Logs (access.log, error.log)
/var/www/html/           → Racine par défaut (sera remplacée)

Étape 2.2 : Démarrage et configuration initiale
bash# Démarrer NGINX
sudo systemctl start nginx
# Commande : systemctl = contrôle systemd (gestionnaire de services Linux)
# Argument : start = démarre le service
# nginx = nom du service à démarrer

# Activer au démarrage système
sudo systemctl enable nginx
# Argument : enable = lance automatiquement au boot
# → Crée un symlink dans /etc/systemd/system/multi-user.target.wants/

# Vérifier le statut
sudo systemctl status nginx
# Attendu :
# ● nginx.service - A high performance web server
#    Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
#    Active: active (running) since [date]
🧪 Test rapide :
bash# Tester depuis la ligne de commande
curl -I http://localhost
# Commande : curl = Client URL (outil de transfert de données)
# Argument : -I = affiche uniquement les headers HTTP (pas le contenu)
# Attendu : HTTP/1.1 200 OK

# Ou ouvre dans le navigateur
# http://localhost
# Attendu : Page "Welcome to nginx!"

📦 Phase 3 : Configuration de Master SPA
Étape 3.1 : Structure du projet Master
bash# Naviguer vers ton projet Master
cd /chemin/vers/master

# Afficher la structure actuelle
tree -L 2 -I 'node_modules'
# Commande : tree = affiche arborescence de fichiers
# Argument : -L 2 = limite à 2 niveaux de profondeur
# Argument : -I 'node_modules' = ignore le dossier node_modules

# Structure attendue :
# master/
# ├── src/
# ├── public/
# ├── server/          ← Backend Express
# ├── package.json
# ├── vue.config.js
# └── dist/            ← Sera créé après build

Étape 3.2 : Configuration Vue (vue.config.js)
📍 Emplacement : /chemin/vers/master/vue.config.js
javascript// Configuration Vue CLI pour production avec NGINX
// Documentation : https://cli.vuejs.org/config/

module.exports = {
  // publicPath : Chemin de base pour tous les assets (JS, CSS, images)
  // '/' = racine du domaine (http://example.com/)
  publicPath: '/',
  
  // outputDir : Dossier de destination du build de production
  outputDir: 'dist',
  
  // assetsDir : Sous-dossier dans dist/ pour les assets statiques
  // Résultat : dist/assets/js/, dist/assets/css/, dist/assets/img/
  assetsDir: 'assets',
  
  // Configuration du serveur de développement (npm run serve)
  devServer: {
    port: 8080,
    
    // Proxy pour développement local (évite CORS)
    // En dev, les requêtes /api/* sont forwardées vers localhost:3000
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // changeOrigin: modifie le header Host pour correspondre à la target
        // Nécessaire pour certains backends qui vérifient le Host
      }
    }
  },
  
  // productionSourceMap : Génère source maps pour debugging
  // false en prod pour réduire la taille et masquer le code source
  productionSourceMap: false
};
🎯 Arguments des choix :

publicPath: '/' : Master est l'app principale à la racine
assetsDir: 'assets' : Organisation propre (tous les assets dans un dossier)
proxy en dev : Simule le comportement NGINX en développement


Étape 3.3 : Configuration Router Vue
📍 Emplacement : /chemin/vers/master/src/router/index.js
javascriptimport Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  // Autres routes...
];

const router = new VueRouter({
  // mode: 'history' = URLs propres sans # (http://example.com/dashboard)
  // Nécessite configuration serveur (NGINX try_files)
  mode: 'history',
  
  // base: '/' = Routes à la racine du domaine
  // Correspond au publicPath de vue.config.js
  base: '/',
  
  routes,
  
  // scrollBehavior : Gère le scroll lors de navigation
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition; // Restaure position si bouton back/forward
    }
    return { x: 0, y: 0 }; // Sinon scroll en haut
  }
});

export default router;
🎯 Argument : mode: 'history' pour URLs propres, mais nécessite NGINX try_files (configuré plus tard).

Étape 3.4 : Configuration Axios
📍 Emplacement : /chemin/vers/master/src/services/http-common.js
javascriptimport axios from 'axios';

// Instance Axios configurée pour l'API backend
const instance = axios.create({
  // baseURL relatif : toutes les requêtes sont préfixées par /api
  // Exemple : axios.get('/jobs') → GET http://example.com/api/jobs
  // NGINX route /api/* vers le backend Express
  baseURL: '/api',
  
  // Headers par défaut
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Timeout global (10 secondes)
  timeout: 10000,
  
  // withCredentials : Envoie cookies dans requêtes cross-origin
  // false par défaut, activer si authentification par cookies
  withCredentials: false
});

// Intercepteur de requête (optionnel)
instance.interceptors.request.use(
  config => {
    // Ajouter token d'authentification si présent
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Intercepteur de réponse (gestion erreurs globale)
instance.interceptors.response.use(
  response => response,
  error => {
    // Gestion centralisée des erreurs HTTP
    if (error.response) {
      console.error(`API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
🎯 Arguments :

baseURL: '/api' (relatif) : NGINX route automatiquement vers le backend
Pas besoin de connaître l'URL absolue du backend
Intercepteurs : Centralise logique auth + gestion erreurs


Étape 3.5 : Configuration Backend Express
📍 Emplacement : /chemin/vers/master/server/app.js
javascriptconst express = require('express');
const cors = require('cors');

const app = express();

// ════════════════════════════════════════════════════════
// MIDDLEWARES
// ════════════════════════════════════════════════════════

// CORS : Cross-Origin Resource Sharing
// Nécessaire si backend sur domaine différent (en dev)
// En production avec NGINX, tout est sur même domaine → CORS non nécessaire
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // '*' en dev, domaine précis en prod
  credentials: true
}));

// Parse JSON dans body des requêtes POST/PUT
app.use(express.json());

// Parse URL-encoded data (formulaires)
app.use(express.urlencoded({ extended: true }));

// Logger simple (remplacer par Winston/Morgan en prod)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ════════════════════════════════════════════════════════
// ROUTES API
// ════════════════════════════════════════════════════════

// Health check (NGINX peut l'utiliser pour monitoring)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Routes métier
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/users', require('./routes/users'));
// ... autres routes

// ════════════════════════════════════════════════════════
// GESTION ERREURS
// ════════════════════════════════════════════════════════

// Route 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path 
  });
});

// Error handler (doit avoir 4 paramètres pour être détecté par Express)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// ════════════════════════════════════════════════════════
// DÉMARRAGE SERVEUR
// ════════════════════════════════════════════════════════

const PORT = process.env.PORT || 3000;

// Écoute sur localhost uniquement (sécurité)
// NGINX forward les requêtes publiques vers ce port local
app.listen(PORT, 'localhost', () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
  console.log(`📍 API endpoints : http://localhost:${PORT}/api/*`);
});
🎯 Arguments :

Écoute sur localhost : Backend non exposé publiquement (sécurité)
CORS permissif en dev, restrictif en prod
Health check /api/health : NGINX peut vérifier que le backend répond


📦 Phase 4 : Configuration de Slave SPA
Étape 4.1 : Configuration Vue (vue.config.js)
📍 Emplacement : /chemin/vers/slave/vue.config.js
javascript// Configuration Slave : ATTENTION au publicPath différent !

module.exports = {
  // ⚠️ CRITIQUE : publicPath = '/slave/'
  // Tous les assets seront préfixés : /slave/assets/js/app.js
  // Sans cela, Slave cherche assets à la racine et retourne 404
  publicPath: '/slave/',
  
  outputDir: 'dist',
  assetsDir: 'assets',
  
  devServer: {
    port: 8081, // Port différent de Master (8080)
    
    // Proxy vers le MÊME backend que Master
    // Les deux apps partagent l'API Express
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Même backend !
        changeOrigin: true
      }
    }
  },
  
  productionSourceMap: false
};
🎯 Arguments critiques :

publicPath: '/slave/' : INDISPENSABLE pour sous-path
Sans ça : assets cherchés à /assets/js/ au lieu de /slave/assets/js/ → 404
Même backend (port 3000) : Les 2 apps partagent les données


Étape 4.2 : Configuration Router Vue
📍 Emplacement : /chemin/vers/slave/src/router/index.js
javascriptimport Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/stations',
    name: 'Stations',
    component: () => import('@/views/Stations.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  
  // ⚠️ CRITIQUE : base = '/slave/' (correspond au publicPath)
  // Sans ça, router génère URLs incorrectes
  // Exemple : router.push('/stations') → http://example.com/slave/stations
  base: '/slave/',
  
  routes,
  
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  }
});

export default router;
🎯 Argument : base: '/slave/' DOIT correspondre au publicPath sinon les routes ne fonctionnent pas.

Étape 4.3 : Configuration Axios (identique à Master)
📍 Emplacement : /chemin/vers/slave/src/services/http-common.js
javascriptimport axios from 'axios';

// Configuration IDENTIQUE à Master
// Les deux apps partagent le même backend via NGINX
const instance = axios.create({
  baseURL: '/api', // NGINX route vers backend :3000
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  withCredentials: false
});

// Intercepteurs identiques à Master (optionnel)
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

export default instance;

🔨 Phase 5 : Build des applications
Étape 5.1 : Créer le dossier de déploiement
bash# Créer dossier pour les apps web
sudo mkdir -p /var/www/master
# Commande : mkdir = make directory
# Argument : -p = crée parents si inexistants (pas d'erreur si existe déjà)
# Emplacement : /var/www/ = convention Linux pour sites web

sudo mkdir -p /var/www/slave

# Donner ownership à ton utilisateur (remplace 'username')
sudo chown -R $USER:$USER /var/www/master
# Commande : chown = change owner
# Argument : -R = récursif (tous fichiers/sous-dossiers)
# $USER:$USER = ton_username:ton_groupe

sudo chown -R $USER:$USER /var/www/slave
📍 Structure finale :
/var/www/
├── master/
│   └── dist/          ← Build Master sera copié ici
└── slave/
    └── dist/          ← Build Slave sera copié ici

Étape 5.2 : Build Master
bash# Naviguer vers Master
cd /chemin/vers/master

# Installer dépendances (si pas déjà fait)
npm install
# Commande : npm = Node Package Manager
# Action : Lit package.json et installe toutes les dépendances dans node_modules/

# Build de production
npm run build
# Action : Exécute script "build" de package.json
# Généralement : vue-cli-service build
# Résultat : Crée dossier dist/ avec assets optimisés (minifiés, hashés)

# Vérifier le build
ls -lh dist/
# Attendu :
# index.html
# assets/
#   js/
#     app.[hash].js
#     chunk-vendors.[hash].js
#   css/
#     app.[hash].css
#   img/

# Copier vers /var/www/
cp -r dist/* /var/www/master/
# Commande : cp = copy
# Argument : -r = récursif (copie dossiers et contenu)
# dist/* = tous fichiers dans dist/
# Destination : /var/www/master/

Étape 5.3 : Build Slave
bash# Naviguer vers Slave
cd /chemin/vers/slave

# Installer dépendances
npm install

# ⚠️ Vérifier publicPath AVANT build
grep publicPath vue.config.js
# Attendu : publicPath: '/slave/'

# Build
npm run build

# Vérifier structure
ls -lh dist/

# Copier vers /var/www/
cp -r dist/* /var/www/slave/

Étape 5.4 : Démarrer le backend avec PM2
bash# Installer PM2 globalement (gestionnaire de processus Node)
sudo npm install -g pm2
# Argument : -g = global (accessible partout)
# PM2 : Redémarre app si crash, logs, monitoring

# Naviguer vers backend
cd /chemin/vers/master/server

# Installer dépendances production uniquement
npm install --production
# Argument : --production = ignore devDependencies

# Démarrer avec PM2
pm2 start app.js --name master-backend
# Argument : --name = nom du process (pour management)

# Vérifier statut
pm2 status
# Attendu :
# ┌─────┬──────────────────┬─────┬───────┬────────┐
# │ id  │ name             │ mode│ ↺     │ status │
# ├─────┼──────────────────┼─────┼───────┼────────┤
# │ 0   │ master-backend   │ fork│ 0     │ online │
# └─────┴──────────────────┴─────┴───────┴────────┘

# Voir logs en temps réel
pm2 logs master-backend

# Sauvegarder config PM2 (redémarre au boot)
pm2 save
pm2 startup
# Exécute la commande affichée (crée service systemd)
🎯 Arguments PM2 :

Process manager robuste (redémarre si crash)
Logs centralisés
Monitoring CPU/RAM


⚙️ Phase 6 : Configuration NGINX
Étape 6.1 : Créer le fichier de configuration
bash# Créer fichier config dans sites-available
sudo nano /etc/nginx/sites-available/master-platform
# Commande : nano = éditeur de texte en terminal
# Emplacement : /etc/nginx/sites-available/ = configs disponibles mais pas actives
📍 Contenu du fichier /etc/nginx/sites-available/master-platform :
nginx# ════════════════════════════════════════════════════════════
# Configuration NGINX pour plateforme Master + Slave
# Documentation : https://nginx.org/en/docs/
# ════════════════════════════════════════════════════════════

# ────────────────────────────────────────────────────────────
# UPSTREAM : Définit le pool de backends
# ────────────────────────────────────────────────────────────
upstream backend_api {
    # Stratégie de load balancing : least_conn
    # Envoie requête au serveur avec le moins de connexions actives
    # Alternatives : round_robin (défaut), ip_hash (sticky sessions)
    least_conn;
    
    # Serveur backend Express
    server localhost:3000 max_fails=3 fail_timeout=30s;
    # max_fails=3 : Marque serveur comme down après 3 échecs
    # fail_timeout=30s : Réessaye après 30 secondes
    
    # Si scaling horizontal (plusieurs backends) :
    # server localhost:3001 max_fails=3 fail_timeout=30s;
    # server localhost:3002 max_fails=3 fail_timeout=30s;
    
    # keepalive : Nombre de connexions TCP réutilisables
    # Réduit latence (évite TCP handshake à chaque requête)
    keepalive 32;
}

# ════════════════════════════════════════════════════════════
# SERVEUR HTTP
# ════════════════════════════════════════════════════════════
server {
    # listen 80 : Écoute requêtes HTTP sur port 80
    # default_server : Serveur par défaut si aucun server_name match
    listen 80 default_server;
    
    # server_name : Domaine(s) accepté(s)
    # localhost = développement local
    # _ = catch-all (accepte n'importe quel domaine)
    server_name localhost _;
    
    # ────────────────────────────────────────────────────────
    # LOGS
    # ────────────────────────────────────────────────────────
    # access_log : Log de toutes les requêtes (200, 404, 500...)
    access_log /var/log/nginx/master-access.log;
    
    # error_log : Log uniquement des erreurs NGINX
    # Niveau : debug | info | notice | warn | error | crit
    error_log /var/log/nginx/master-error.log warn;
    
    # ────────────────────────────────────────────────────────
    # SECURITY HEADERS
    # ────────────────────────────────────────────────────────
    # X-Frame-Options : Empêche iframe (protection clickjacking)
    add_header X-Frame-Options "SAMEORIGIN" always;
    
    # X-Content-Type-Options : Empêche MIME sniffing
    add_header X-Content-Type-Options "nosniff" always;
    
    # X-XSS-Protection : Active filtre XSS navigateur
    add_header X-XSS-Protection "1; mode=block" always;
    
    # ════════════════════════════════════════════════════════
    # LOCATION 1 : Backend API
    # ════════════════════════════════════════════════════════
    location /api/ {
        # proxy_pass : Forward requête vers backend
        # Requête http://example.com/api/jobs → http://localhost:3000/api/jobs
        proxy_pass http://backend_api;
        
        # ────────────────────────────────────────────────────
        # HEADERS PROXY (préserve info client)
        # ────────────────────────────────────────────────────
        # Host : Domaine demandé par client (example.com)
        proxy_set_header Host $host;
        
        # X-Real-IP : IP réelle du client (pas celle de NGINX)
        proxy_set_header X-Real-IP $remote_addr;
        
        # X-Forwarded-For : Chaîne complète d'IPs (client → proxies → serveur)
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # X-Forwarded-Proto : Protocole utilisé (http ou https)
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # ────────────────────────────────────────────────────
        # TIMEOUTS
        # ────────────────────────────────────────────────────
        # proxy_connect_timeout : Temps max pour établir connexion backend
        proxy_connect_timeout 60s;
        
        # proxy_send_timeout : Temps max pour envoyer requête au backend
        proxy_send_timeout 60s;
        
        # proxy_read_timeout : Temps max pour recevoir réponse du backend
        # Important : Augmenter si requêtes lentes (rapports, exports...)
        proxy_read_timeout 60s;
        
        # ────────────────────────────────────────────────────
        # WEBSOCKET SUPPORT (si nécessaire)
        # ────────────────────────────────────────────────────
        # proxy_http_version : Force HTTP/1.1 (nécessaire WebSocket)
        proxy_http_version 1.1;
        
        # Upgrade : Passe header Upgrade (WebSocket handshake)
        proxy_set_header Upgrade $http_upgrade;
        
        # Connection : Gère upgrade de connexion
        proxy_set_header Connection "upgrade";
        
        # ────────────────────────────────────────────────────
        # BUFFERS (optimisation performance)
        # ────────────────────────────────────────────────────
        # proxy_buffering : Active mise en buffer des réponses
        # on = NGINX lit réponse backend puis envoie client (libère backend)
        # off = Stream direct (SSE, long polling)
        proxy_buffering on;
        
        # Taille buffers (ajuster selon volume réponses)
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }
    
    # ════════════════════════════════════════════════════════
    # LOCATION 2 : Slave SPA
    # ════════════════════════════════════════════════════════
    location /slave/ {
        # alias : Remplace /slave/ par /var/www/slave/
        # Requête /slave/index.html → /var/www/slave/index.html
        # ⚠️ Différent de root qui AJOUTE le path
        alias /var/www/slave/;
        
        # try_files : Essaye fichiers dans l'ordre
        # $uri = chemin exact demandé
        # $uri/ = chemin en tant que dossier
        # /slave/index.html = fallback (Vue Router mode history)
        #
        # Exemple : GET /slave/stations
        # 1. Cherche /var/www/slave/stations (fichier) → non
        # 2. Cherche /var/www/slave/stations/ (dossier) → non
        # 3. Retourne /var/www/slave/index.html → Vue Router gère /stations
        try_files $uri $uri/ /slave/index.html;
        
        # ────────────────────────────────────────────────────
        # CACHE ASSETS STATIQUES
        # ────────────────────────────────────────────────────
        # Regex : Fichiers JS, CSS, images, fonts
        location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
            # expires 1y : Cache navigateur pendant 1 an
            # Fichiers ont hash dans nom (app.abc123.js) → cache busting
            expires 1y;
            
            # Cache-Control : Directives de cache
            # public = Peut être caché par proxies intermédiaires
            # immutable = Fichier ne changera jamais (avec ce hash)
            add_header Cache-Control "public, immutable";
            
            # access_log off : Ne log pas assets (réduit I/O disque)
            access_log off;
        }
    }
    
    # ════════════════════════════════════════════════════════
    # LOCATION 3 : Master SPA (doit être en dernier)
    # ════════════════════════════════════════════════════════
    location / {
        # root : Racine des fichiers statiques
        # Requête /dashboard → /var/www/master/dashboard
        root /var/www/master;
        
        # index : Fichier par défaut si dossier demandé
        # Requête / → /var/www/master/index.html
        index index.html;
        
        # try_files : Identique à Slave mais fallback différent
        # Requête /dashboard → index.html → Vue Router gère /dashboard
        try_files $uri $uri/ /index.html;
        
        # ────────────────────────────────────────────────────
        # CACHE ASSETS
        # ────────────────────────────────────────────────────
        location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
    }
    
    # ════════════════════════════════════════════════════════
    # MONITORING NGINX (optionnel)
    # ════════════════════════════════════════════════════════
    location /nginx_status {
        # stub_status : Active page de stats NGINX
        # Affiche : connexions actives, requêtes/s, etc.
        stub_status;
        
        # Sécurité : Accessible uniquement depuis localhost
        allow 127.0.0.1;
        deny all;
    }
}
🎯 Explications clés :
DirectiveRôleArgument du choixupstreamPool de backendsLoad balancing + failoverlocation /api/Route APINGINX forward vers Expresslocation /slave/Route Slavealias pour remplacer pathlocation /Route MasterDoit être en dernier (catch-all)try_filesFallback SPASupport Vue Router mode historyproxy_set_headerHeaders proxyBackend voit vraie IP clientkeepaliveConnexions persistantesRéduit latence TCPexpires 1yCache navigateurRéduit bande passante

Étape 6.2 : Activer la configuration
bash# Créer symlink sites-enabled → sites-available
sudo ln -s /etc/nginx/sites-available/master-platform /etc/nginx/sites-enabled/
# Commande : ln = link (créer lien)
# Argument : -s = symbolic (lien symbolique, comme raccourci)
# Source : fichier dans sites-available
# Destination : lien dans sites-enabled
# Convention NGINX : Seuls fichiers dans sites-enabled sont chargés

# Désactiver site par défaut (optionnel)
sudo rm /etc/nginx/sites-enabled/default
# Supprime lien (pas le fichier original dans sites-available)

# Tester syntaxe NGINX (CRITIQUE avant reload)
sudo nginx -t
# Argument : -t = test configuration
# Vérifie syntaxe + chemins fichiers
# Attendu :
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Si erreurs :
# - Vérifier accolades {} bien fermées
# - Vérifier ; à la fin des lignes
# - Vérifier chemins /var/www/ existent

Étape 6.3 : Recharger NGINX
bash# Recharger configuration (0 downtime)
sudo systemctl reload nginx
# reload = recharge config sans couper connexions existantes
# Préféré à restart en production

# Vérifier logs pour erreurs
sudo tail -f /var/log/nginx/master-error.log
# Commande : tail = affiche fin de fichier
# Argument : -f = follow (suit en temps réel)
# Ctrl+C pour quitter

# Vérifier statut service
sudo systemctl status nginx
# Attendu : Active: active (running)

✅ Phase 7 : Tests et validation
Étape 7.1 : Tests fonctionnels
bash# ────────────────────────────────────────────────────────
# TEST 1 : Master SPA (racine)
# ────────────────────────────────────────────────────────
curl -I http://localhost/
# Argument : -I = headers uniquement
# Attendu :
# HTTP/1.1 200 OK
# Content-Type: text/html

# Ou navigateur :
# http://localhost/

# ────────────────────────────────────────────────────────
# TEST 2 : Slave SPA (sous-path)
# ────────────────────────────────────────────────────────
curl -I http://localhost/slave/
# Attendu : HTTP/1.1 200 OK

# Navigateur :
# http://localhost/slave/

# ────────────────────────────────────────────────────────
# TEST 3 : Backend API
# ────────────────────────────────────────────────────────
curl http://localhost/api/health
# Attendu : {"status":"ok","timestamp":"..."}

# Si erreur 502 Bad Gateway :
# → Backend Express pas démarré ou port incorrect
pm2 status  # Vérifier backend online

# ────────────────────────────────────────────────────────
# TEST 4 : Assets Slave (vérifier publicPath)
# ────────────────────────────────────────────────────────
curl -I http://localhost/slave/assets/js/app.*.js
# Remplacer * par hash réel (voir dist/)
# Attendu :
# HTTP/1.1 200 OK
# Cache-Control: public, immutable

# Si 404 :
# → publicPath incorrecte dans vue.config.js
# → Rebuild nécessaire

# ────────────────────────────────────────────────────────
# TEST 5 : Vue Router (mode history)
# ────────────────────────────────────────────────────────
# Navigateur : http://localhost/dashboard
# Rafraîchir (F5)
# Attendu : Page charge (pas 404)
# → Prouve que try_files fonctionne

Étape 7.2 : Vérifier logs
bash# Logs d'accès (requêtes réussies/échouées)
sudo tail -50 /var/log/nginx/master-access.log
# Argument : -50 = dernières 50 lignes

# Chercher erreurs 404
grep " 404 " /var/log/nginx/master-access.log

# Logs d'erreurs NGINX
sudo tail -50 /var/log/nginx/master-error.log

# Logs backend (PM2)
pm2 logs master-backend --lines 50
# Argument : --lines 50 = dernières 50 lignes

Étape 7.3 : Ouvrir DevTools navigateur
1. Ouvrir http://localhost/
2. F12 → Onglet Network
3. Recharger page (Ctrl+R)

Vérifier :
✅ index.html → 200 OK
✅ /assets/js/app.[hash].js → 200 OK (Cache-Control: immutable)
✅ /assets/css/app.[hash].css → 200 OK

Faire une requête API (dans app) :
✅ /api/jobs → 200 OK (Content-Type: application/json)

Naviguer vers http://localhost/slave/
✅ /slave/index.html → 200 OK
✅ /slave/assets/js/app.[hash].js → 200 OK

Si assets retournent 404 :
→ Vérifier publicPath dans vue.config.js
→ Rebuild + recopier dist/

🐛 Dépannage courant
Problème 1 : 502 Bad Gateway sur /api/
bash# Cause : Backend Express pas accessible

# Vérifier backend démarré
pm2 status
# Si offline :
pm2 restart master-backend

# Vérifier port 3000 écoute
sudo netstat -tlnp | grep :3000
# Attendu : tcp 0 0 127.0.0.1:3000 ... LISTEN [PID]/node

# Tester backend directement
curl http://localhost:3000/api/health
# Si ça marche : Problème config NGINX
# Si ça marche pas : Problème backend

Problème 2 : 404 sur assets Slave (/slave/assets/...)
bash# Cause : publicPath incorrect

# Vérifier publicPath
cd /chemin/vers/slave
grep publicPath vue.config.js
# Doit afficher : publicPath: '/slave/'

# Si différent, corriger puis rebuild
npm run build
cp -r dist/* /var/www/slave/

# Vérifier fichiers copiés
ls -la /var/www/slave/assets/js/
# Fichiers doivent exister

Problème 3 : 404 après refresh sur route (/dashboard)
bash# Cause : try_files mal configuré

# Vérifier config NGINX
sudo nginx -t

# Vérifier location /
grep -A5 "location /" /etc/nginx/sites-available/master-platform
# Doit contenir : try_files $uri $uri/ /index.html;

# Si absent, ajouter et reload
sudo systemctl reload nginx

Problème 4 : CORS errors dans console
bash# Cause : Headers CORS manquants

# Vérifier backend Express utilise cors()
# Voir server/app.js

# Ou ajouter headers NGINX (moins recommandé)
# Dans location /api/ :
add_header Access-Control-Allow-Origin "*" always;
add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE" always;

📊 Schéma de flux final
┌─────────────────────────────────────────────────┐
│  Navigateur demande :                           │
│  http://localhost/slave/stations                │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │  NGINX :80         │
        │  Lit config        │
        └────────┬───────────┘
                 │
      Location matching...
                 │
    ┌────────────▼────────────┐
    │ location /slave/ {}     │
    │ alias /var/www/slave/   │
    └────────┬────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ try_files $uri /slave/index.html │
    └────────┬─────────────────────┘
             │
             │ Fichier non trouvé
             ▼
    ┌────────────────────────┐
    │ Retourne index.html    │
    │ Vue Router route       │
    │ /stations              │
    └────────┬───────────────┘
             │
             │ App charge
             ▼
    ┌─────────────────────────────┐
    │ index.html charge           │
    │ /slave/assets/js/app.js     │
    │ Vue Router active /stations │
    │ Axios appelle /api/stations │
    └────────┬────────────────────┘
             │
             │ Nouvelle requête
             ▼
    ┌──────────────────────────────┐
    │ NGINX reçoit GET /api/stations│
    └────────┬─────────────────────┘
             │
             │ Location /api/
             ▼
    ┌──────────────────────────────┐
    │ proxy_pass                   │
    │ http://backend_api           │
    │ (localhost:3000)             │
    └────────┬─────────────────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │ Express traite /api/stations│
    │ Sequelize query MySQL       │
    │ Retourne JSON               │
    └────────┬────────────────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │ NGINX forward réponse       │
    │ Vue affiche stations        │
    └─────────────────────────────┘

📋 Checklist finale
Avant de déclarer terminé, vérifier :

 NGINX installé et démarré (systemctl status nginx)
 Backend Express démarré avec PM2 (pm2 status)
 publicPath: '/' dans master/vue.config.js
 publicPath: '/slave/' dans slave/vue.config.js
 base: '/slave/' dans slave router
 Builds générés (npm run build dans chaque app)
 Fichiers copiés dans /var/www/master/ et /var/www/slave/
 Config NGINX créée (/etc/nginx/sites-available/master-platform)
 Symlink activé (/etc/nginx/sites-enabled/master-platform)
 nginx -t passe sans erreur
 NGINX rechargé (systemctl reload nginx)

Tests fonctionnels :

 http://localhost/ affiche Master
 http://localhost/slave/ affiche Slave
 http://localhost/api/health retourne JSON
 Assets Master chargent (DevTools Network)
 Assets Slave chargent (/slave/assets/...)
 Refresh sur route fonctionne (F5 sur /dashboard)
 Requêtes API fonctionnent depuis les 2 apps
 Logs NGINX sans erreur 404


🚀 Commandes de maintenance
bash# Rebuild + redéploiement Master
cd /chemin/vers/master
npm run build
cp -r dist/* /var/www/master/

# Rebuild + redéploiement Slave
cd /chemin/vers/slave
npm run build
cp -r dist/* /var/www/slave/

# Redémarrer backend
pm2 restart master-backend

# Recharger NGINX (après modif config)
sudo nginx -t && sudo systemctl reload nginx

# Voir logs temps réel
pm2 logs master-backend --lines 100
sudo tail -f /var/log/nginx/master-access.log
sudo tail -f /var/log/nginx/master-error.log

# Monitoring NGINX
curl http://localhost/nginx_status

🎉 Ton architecture est maintenant opérationnelle !
Master à la racine (/), Slave sous /slave/, les deux partageant le même backend (/api/*) via NGINX.
Besoin d'aide pour SSL (HTTPS) ou un point spécifique ? 🔐