import Vue from 'vue'
import Router from 'vue-router'


// Containers
//const DefaultContainer = () => import('@/containers/DefaultContainer')

// Views

const SurahList = () => import('@/views/SurahList')

const Surah = () => import('@/views/Surah')

const Ayah = () => import('@/views/Ayah')

const Search = () => import('@/views/Search')

const Bookmark = () => import('@/views/Bookmark')

Vue.use(Router)

export default new Router({
  mode: 'history', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
        {
          path: '/',
          name: 'SurahList',
          meta: { layout: "no-sidebar" },
          component: SurahList,       
        },
        {
          path: '/:surah_id',
          name: 'Surah',
          meta: { layout: "default" },
          component: Surah,         
        },
        {
          path: '/:surah_id/:ayah_id',
          name: 'Ayah',
          component: Ayah,
        },
        {
          path: '/search/keyword/:q',
          name: 'Search',
          component: Search,
          meta: { layout: "no-sidebar" },
        },  
        {
          path: "/404",
          name: "not-found",
          meta: { layout: "no-sidebar" },
          component: require("@/pages/404.vue").default // load sync home
        }, 
        {
          path: '/page/user/bookmark',
          name: 'Bookmark',
          component: Bookmark,
        },                                         
  ]  
})
