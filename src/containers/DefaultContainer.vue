<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler class="d-lg-none" display="md" mobile />
      <b-link class="navbar-brand" to="/home">
        <span>Al-Quran</span>
      </b-link>
      <SidebarToggler class="d-md-down-none" display="lg" />
      <b-navbar-nav class="d-md-down-none">
        <b-nav-item class="px-3 color-green" to="/home"><i class='icon-home'></i></b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto top-right-bar">
         
        <!-- <b-form-checkbox v-model="ayah_view" v-on:change="toggleAyahView" class="mr-2" name="check-button" switch>
          Page View
        </b-form-checkbox> -->


        <b-nav-item-dropdown
          id="surahs-nav-dropdown"
          class="mr-3"
          text="Surahs"
          right
          v-if="surahs.length>0"
          
        >
          <b-dropdown-item v-for="item in surahs" :key="item.number" :to="{ name: 'Surah', params: { surah_id: parseInt(item.number) }}">
            <span class="mr-1">{{item.number}}.</span> <span class="mr-2">{{item.englishName}}</span>
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-button
        variant="link" 
        class="d-none">
        <i class="icon-magnifier"></i>
        </b-button>

        <b-form inline class="top-search mr-4 d-none d-sm-none d-md-block">
          <label class="sr-only" for="search">Search</label>
          <b-input class="mb-2 mr-sm-2 mb-sm-0" id="search" placeholder="Search" v-model="search"/>
          <router-link tag="button" :to="{ name: 'Search', params: { q: search }}" class="btn search-btn color-green"><i class="icon-magnifier"></i></router-link>
        </b-form>

        <b-button 
        @click="getFavorites" 
        v-b-modal.bookmark
        v-b-tooltip.hover 
        title="Bookmark" 
        variant="link" 
        v-bind:class="{ active: favorites.length>0 }">
        <i class="icon-pin"></i>
        </b-button>
       
      </b-navbar-nav>
      <!-- <AsideToggler class="d-none d-lg-block" />
      <AsideToggler class="d-lg-none" mobile /> -->
    </AppHeader>
    <div class="app-body" v-bind:class="{ 'theme-dark' : nightMode }">
      <AppSidebar fixed>
        <SidebarHeader/>
        <!-- <SidebarForm/> -->
        <!-- <SidebarNav :navItems="nav"></SidebarNav> -->
        <DefaultAside/>
        <!-- <SidebarFooter/>
        <SidebarMinimizer/> -->
      </AppSidebar>
      <main class="main">
        <!-- <Breadcrumb :list="list"/> -->
        <b-modal id="bookmark" centered scrollable title="Bookmarks" ok-only>


            <div class="mb-1" v-for="(favorite, index) in favorites" :key="index">
              <router-link
                :to="{ name: 'Ayah', params: { surah_id: favorite.split(':')[0], ayah_id: favorite.split(':')[1] }}"
                tag="span"
                active-class="active">
                <b-button variant="link" class="float-left" v-on:click="removeFavorites" :data-favoriteid="favorite.split(':')[0]+':'+favorite.split(':')[1]">
                  <i class="icon-close"></i>
                </b-button>                 
                <a class="nav-link"><span v-b-tooltip.hover v-bind:title="'Surah:'+ favorite.split(':')[0] +' Verse:' + favorite.split(':')[1]" class="label label-default" :name="favorite.split(':')[0]+':'+favorite.split(':')[1]">{{favorite.split(':')[0]+':'+favorite.split(':')[1]}}</span></a>
              </router-link>              
            </div>

            <div v-if="Object.keys(favorites).length === 0">No Bookmark</div>
          
        </b-modal>
        <b-container>
          <router-view></router-view>
        </b-container>
      </main>
      <!-- <AppAside fixed class="aside-right-menu">
        <DefaultAside/>
      </AppAside> -->
    </div>
    <TheFooter>
      <!--footer-->
      <b-container>
      <b-row>
        <b-col md="12">
          <b-nav class="ml-1">
            <li><a href="https://learntrueislam.com/">Learn True Islam</a></li>
            <li class="ml-3"><a href="https://learntrueislam.com/privacy-policy/">Privacy</a></li>
          </b-nav>
        </b-col>
      </b-row>
    </b-container>
    </TheFooter>
  </div>
</template>

<script>

import axios from 'axios';

import { Header as AppHeader, SidebarToggler, Sidebar as AppSidebar, SidebarFooter, SidebarForm, SidebarHeader, SidebarMinimizer, SidebarNav, Aside as AppAside, AsideToggler, Footer as TheFooter, Breadcrumb } from '@coreui/vue'
import DefaultAside from './DefaultAside'

import { bus } from '@/main'

export default {
  name: 'DefaultContainer',
  components: {
    AsideToggler,
    AppHeader,
    AppSidebar,
    AppAside,
    TheFooter,
    Breadcrumb,
    DefaultAside,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer
  },
  data () {
    return {
      search: null,
      sura_selected: null,
      surahs: [],
      nightMode: JSON.parse(localStorage.getItem("nightMode")) || false,
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
      ayah_view: true
    }
  },
  methods: {
    toggleAyahView: function(){
      console.log('working');
    },
    getSuraList() {

      this.error = null
      this.loading = true
      this.surahs.length = 0

      axios.get('/surah')
        .then(response => {
          // handle success
          this.loading = false
          this.surahs = response.data.data
          

        })
        .catch(error => {
          this.loading = false
          this.error = error.toString()
        });

    },
    setDefaultIdentifiers: function() {
        //save identifier_selected on localStorage
        if (!localStorage.getItem('identifier_selected')) {
          //set Default
          localStorage.setItem('identifier_selected', JSON.stringify(['quran-simple','en.sahih']));
      }
    },
    getFavorites: function() {
        this.favorites = JSON.parse(localStorage.getItem('favorites'));
    },    
     removeFavorites: function(e) {

      let id = e.currentTarget.getAttribute('data-favoriteid')

      let index = this.favorites.indexOf(id)

      // item is already favorite
      this.favorites.splice(index, 1)

      // store array in local storage
      localStorage.setItem('favorites', JSON.stringify(this.favorites));

    },     
  },
  created: function (){

    setTimeout(function(){

      //document.body.classList.remove('sidebar-lg-show','sidebar-minimized','aside-menu-lg-show')

    }, 100)

    this.setDefaultIdentifiers()
    this.getSuraList()

    bus.$on('nightmode_event', obj => {
            // do stuff with obj
            this.nightMode = obj
        })


  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      console.log(to.name)

      if(to.name=='SurahList'){
        setTimeout(function(){

          //document.body.classList.remove('sidebar-lg-show','sidebar-minimized','aside-menu-lg-show')

        }, 100)
      }

    } 
  },
  computed: {
    name () {
      return this.$route.name
    },
    // list () {
    //   return this.$route.matched.filter((route) => route.name || route.meta.label )
    // }
  },
}
</script>
