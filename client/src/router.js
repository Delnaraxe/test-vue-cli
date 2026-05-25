import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

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