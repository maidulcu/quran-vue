<template>
    <AppHeader fixed >
      
      <b-link class="navbar-brand" to="/">
        <span>Al-Quran</span>
      </b-link>
      <SidebarToggler class="d-lg-none" display="md" mobile role="button" aria-label="Toggle Sidebar" />
      
      <!-- <b-navbar-nav class="d-md-down-none">
        <b-nav-item class="px-3 color-green" to="/">Surahs</b-nav-item>
      </b-navbar-nav> -->
      <div class="top-search">
      
        <b-form inline>
          <label class="sr-only" for="search">Search</label>
          <b-input class="mb-2 mr-sm-2 mb-sm-0" id="search" placeholder="Search" v-model="search"/>
          <router-link tag="button" :to="{ name: 'Search', params: { q: search }}" class="btn search-btn color-green" role="button" aria-label="Search"><i class="quran-icon icon-search">&#xe804;</i></router-link>
        </b-form>

      </div>
      <b-navbar-nav class="ml-auto top-right-bar">
         <!-- {{this.surahs}} -->
        <!-- <b-form-checkbox v-model="ayah_view" v-on:change="toggleAyahView" class="mr-2" name="check-button" switch>
          Page View
        </b-form-checkbox> -->
        <li>
          <SidebarToggler class="d-md-down-none desktop-sidebar-toggler" display="lg" role="button" aria-label="Toggle Sidebar" />
        </li>        
        <li>
          <b-button variant="link" v-b-modal.modal-1>Translations</b-button>
        </li>

        <li class="mr-3">
        <router-link to="/page/user/bookmark" role="button" aria-label="Bookmark">Bookmark</router-link>
       </li>
      </b-navbar-nav>

    <!-- Modal -->
    <b-modal id="modal-1" size="xl" title="Surah Translations">
        <div v-if="getEditions.length === 0">Loading...</div>
          <div v-for="item in getEditions" :key="item.identifier" class="identifier">
          <input type="checkbox" :id="item.identifier" :value="item.identifier" v-model="identifier_selected">
          <label :for="item.identifier">{{item.name}} <span>{{item.englishName}}</span></label>
        </div>

    </b-modal>

    </AppHeader>
</template>

<script>

import { Header as AppHeader, SidebarToggler } from '@coreui/vue'

import { bus } from '@/main'

//import edition json globally
import Editions from '@/json/edition.json'

export default {
  name: 'Header',
  components: {
    AppHeader,
    SidebarToggler,
  },
  data () {
    return {
      search: null,
      sura_selected: null,
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
      ayah_view: true,
      identifier_selected: ['quran-simple','en.sahih'],//set default
      identifier_list: [],
      editions: Editions.data,
    }
  }, 
  methods: {

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
       updateIdentifiers: function() {

        //save identifier_selected on localStorage
        if (localStorage.getItem('identifier_selected')) {
          try {

            this.identifier_selected = JSON.parse(localStorage.getItem('identifier_selected'));

            //check if value exist, if not set value
            if(this.identifier_selected==0){
              this.identifier_selected = ['quran-simple','en.sahih']
            }

          } catch(e) {
            localStorage.removeItem('identifier_selected');
          }
        }else{

          //set Default
          this.identifier_selected = ['quran-simple','en.sahih']
          localStorage.setItem('identifier_selected', JSON.stringify(this.identifier_selected));

        }

      },   
    langIdentifiers: function() {

      this.error = null
      this.identifier_list.length = 0

      this.$http.get('/edition')
          .then(response => {

                this.loading = false

                let exclude_translation = ['quran-simple','en.ahmedraza','en.maududi','en.transliteration','en.walk']

                let lang_grouped = []

                lang_grouped = this.$_.orderBy(response.data.data, ['language'], ['asc'])


                lang_grouped = this.$_.remove(lang_grouped, obj => !exclude_translation.includes(obj.identifier));

                lang_grouped.forEach((value) => {
                  this.identifier_list.push({
                    'value': value.identifier,
                    'text': '<span class="identifier-lang">'+this.getLanguageName(value.language)+ '</span> : ' +value.englishName,
                  })
                })
                //manauly add
                // this.identifier_list.push({
                //   'value': 'bn.bengali',
                //   'text': '<span class="identifier-lang">'+this.getLanguageName('bn')+ '</span> : Muhiuddin Khan'
                // })
                // this.identifier_list.push({
                //   'value': 'hi.hindi',
                //   'text': '<span class="identifier-lang">'+this.getLanguageName('hi')+ '</span> : Suhel Farooq Khan and Saifur Rahman Nadwi'
                // })
                // this.identifier_list.push({
                //   'value': 'tr.diyanet',
                //   'text': '<span class="identifier-lang">'+this.getLanguageName('tr')+ '</span> : Diyanet Isleri'
                // })
          })
          .catch(error => {
            this.loading = false
            this.error = error.toString()
          })
  },    
  },
  created: function (){
    this.updateIdentifiers()
    this.setDefaultIdentifiers()
    //this.langIdentifiers()

  },
   watch: {
    identifier_selected(value) {
      
      //get selectd value
      let parsed = JSON.stringify(value)
      let get_identifier = JSON.parse(localStorage.getItem('identifier_selected'))


      // console.log(JSON.parse(parsed))
      // console.log(get_identifier)
      // console.log(this.lodash.isEqual(JSON.parse(parsed),get_identifier))

      //if local storage and slected value is differnet then emit event
      if(!this.$_.isEqual(JSON.parse(parsed),get_identifier)){
        bus.$emit('identifier_event', parsed)
      }

      //save on local storage
      localStorage.setItem('identifier_selected', parsed)

    },
  }, 
   computed: {
    // a computed getter
    getEditions: function () {

      let exclude_translation = ['quran-simple','en.ahmedraza','en.maududi','en.transliteration','en.walk','quran-wordbyword','quran-tajweed']

      let lang_grouped = []

      //order by langaue
      lang_grouped = this.$_.orderBy(Editions.data, ['language'], ['asc'])
      //remove some
      lang_grouped = this.$_.remove(lang_grouped, obj => !exclude_translation.includes(obj.identifier));

      return lang_grouped
      

    }
  } 
}
</script>
