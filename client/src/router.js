/** Associe une URL à composant vue/name
 * Pas de rechargement complet de la page
 * vue-router => npm install vue-router@3 */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
/** 'Vue.use(Router);' rend disponible : 
 * <router-view>
 * <router-link>
 * this.$router => moteur du router 
 * 		actions : push(), replace(), back()
 * this.$route => la route actuelle
 * 		lecture : params, query, path, meta
 */

const router = new Router({
	routes: [
		{
			path: '/hello',
			name: 'hello',
			component: () => import('./components/HelloWorld.vue')
		},
  ]
});

export default router;