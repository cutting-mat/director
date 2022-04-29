import { createRouter, createWebHashHistory } from "vue-router"

export default createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        name: 'Index',
        component: () => import("./views/Index.vue"),
        children: [
            {
                path: 'Page1',
                name: 'Page1',
                component: () => import("./views/Page1.vue")
            },
            {
                path: 'Page2',
                name: 'Page2',
                component: () => import("./views/Page2.vue")
            }
        ]
    }]
})