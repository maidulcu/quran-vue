<template>
<div class="container">
    <div v-if="error" class="error">
      {{ error }}
    </div>
        <b-row class="mb-4 mt-5">
            <div class="col-12">
                <p>Search result for: <strong>{{this.$route.params.q}}</strong></p>
                <p v-if="searchStatus==200" class="font-italic">{{this.searchDataCount}} ayahs were found matching your search.</p>
            </div>
        </b-row>
        <b-row class="mb-5" v-if="searchStatus==200">
           
            <div class="col-12 mb-5" v-for="(item, index) in searchData" :key="index">
                
                <p v-html="highlight(item.text)"></p>

                <router-link
                :to="{ name: 'Ayah', params: { surah_id: item.surah.number, ayah_id: item.numberInSurah }}"
                tag="p">
                    <a class="font-weight-bold">{{item.surah.number}}:{{item.numberInSurah}} {{item.surah.englishName}}</a>
                </router-link>
                <span class="badge badge-secondary">{{item.edition.englishName}}</span>
            </div>            
        </b-row>
        <Loader numbers="1" v-if="loading"/>     

  </div>
</template>
<script>
const Loader = () => import('@/components/Loader')
import { bus } from '@/main';

export default {
  name: 'Search',
  components: {
    Loader,
  },  
  data () {
    return {
      loading: false,
      error: null,
      searchData: [],
      searchDataCount: 0,
      searchStatus: null,  
    }
  },
   watch: {
    '$route': 'search',
  }, 
    methods: {
    search: function(){

      if(this.loading){
        //its already running skip
        return;
      }

      if(!this.$route.params.q){
        return;
      }
      this.error  = null
      this.loading = true
      this.searchData.length = 0
      this.searchDataCount = 0

    this.$http.get('https://api.alquran.cloud/v1/search/'+ this.$route.params.q +'/all/en')
        .then(response => {
        // handle success
        //console.log(response)

        if(response.data){
            this.loading = false
            this.searchData = response.data.data.matches
            this.searchDataCount = response.data.data.count
        }
        this.searchStatus = response.status

        })
        .catch(error => {
        this.error = error.toString()
        });

    },     
    highlight: function(words) {

        if (this.$route.params.q == null) {
          return words
        }
        return words.replace(this.$route.params.q, '<span class="badge badge-warning">' + this.$route.params.q + '</span>')

    }   
  },
    created: function (){

        this.search()

    }, 
  
}
</script>
