import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/images',
			name: 'images',
			component: () => import('../views/ImagesView.vue'),
		},
		{
			path: '/videos',
			name: 'videos',
			component: () => import('../views/VideosView.vue'),
		},
		{
			path: '/components',
			name: 'components',
			component: () => import('../views/ComponentsView.vue'),
		},
	],
})

export default router
