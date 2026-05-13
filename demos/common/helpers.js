import { createRouter, createWebHashHistory } from "vue-router";
import { links as raw } from "../routes";

const flatLinks = raw.flatMap(g => g.items);

// Create route configuration for Vue Router
function getRoutes(skinSettings) {
	const routes = flatLinks.map((a) => ({
		path: a[0],
		component: a[2],
		props: { ...skinSettings }
	}));

	// Add redirect from root to default route
	routes.unshift({
		path: "/",
		redirect: "/base/willow",
	});

	return routes;
}

function getLinks() {
	return raw;
}

function getFlatLinks() {
	return flatLinks;
}

// Create router instance
const router = createRouter({
	history: createWebHashHistory(),
	routes: getRoutes({}),
});

export { router, getRoutes, getLinks, getFlatLinks };
