<template>
  <div class="container">
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <vue-headful 
             :title="'Bookmarks - Al-Quran (القرآن)'"
             :description="'Al-Quran Bookmarks'"
         />    
    <b-row class="mb-4 mt-5">
        <div class="col-12">
            <h2>Bookmarks</h2>
        </div>
    </b-row>
    <b-row class="mb-5">
        <div class="col-12 mb-1" v-for="(favorite, index) in favorites" :key="index">
          <router-link
            :to="{ name: 'Ayah', params: { surah_id: favorite.split(':')[0], ayah_id: favorite.split(':')[1] }}"
            tag="span"
            active-class="active">
            <b-button variant="link" class="float-left" v-on:click="removeFavorites" :data-favoriteid="favorite.split(':')[0]+':'+favorite.split(':')[1]">
              <i class="quran-icon icon-cancel-circled2">&#xe809;</i>
            </b-button>                 
            <a class="nav-link"><span v-b-tooltip.hover v-bind:title="'Surah:'+ favorite.split(':')[0] +' Verse:' + favorite.split(':')[1]" class="label label-default" :name="favorite.split(':')[0]+':'+favorite.split(':')[1]">{{favorite.split(':')[0]+':'+favorite.split(':')[1]}}</span></a>
          </router-link>              
        </div>

        <div class="col-12" v-if="Object.keys(favorites).length === 0">No Bookmark</div>
    </b-row>
     

  </div>
</template>
<script>

export default {
  name: 'Bookmark',
  data () {
    return {
      loading: false,
      error: null,
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    }
  },
  methods: {   
    removeFavorites: function(e) {

    let id = e.currentTarget.getAttribute('data-favoriteid')

    let index = this.favorites.indexOf(id)

    // item is already favorite
    this.favorites.splice(index, 1)

    // store array in local storage
    localStorage.setItem('favorites', JSON.stringify(this.favorites));

  },    
  }
  
}
</script>
