<template>
    <div>

      <audio ref="audio" preload="auto" id="player">
        <source id="audioSource" src=""></source>
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>

      <div v-if="error" class="error">
        {{ error }}
      </div>
      <vue-headful v-if="suraMeta.length>0"
               :title="'Surah ' + suraMeta[0].englishName + ' ['+suraMeta[0].number+'] ' + suraMeta[0].name + ' - Al-Quran (القرآن)'"
               :description="'Al-Quran Surah' + suraMeta[0].englishName"
           />

      <header v-if="suraMeta.length>0" class="mt-5 mb-5">
        <b-row>
          <div class="col-12">
            <h1 class="surah-title">{{suraMeta[0].englishName}}  <span class="text-arabic">{{suraMeta[0].number | arabicLatter}} {{suraMeta[0].name}}</span></h1>
            <span class="edition-meta">{{suraMeta[0].number}}. {{suraMeta[0].englishNameTranslation}} / {{suraMeta[0].revelationType}} / Ayahs: {{suraMeta[0].numberOfAyahs}}</span>
          </div>
        </b-row>
      </header>

      <div class="sura-wrapper">


      <b-row class="mb-5 mt-5" v-for="(values, index) in sura_list" :key="index" :data-num="index + 1">
          <div v-bind:class="[index==0 ? 'mb-3 col-12' : 'mb-3 col-12 translation']"  v-for="(value, index) in values" :key="index">

            <div v-if="index==0" class="d-flex ayah-meta mt-4 mb-4">

                  <router-link
                    v-if="suraMeta.length>0 && index==0"
                    :to="{ name: 'Ayah', params: { surah_id: suraMeta[0].number, ayah_id: values[0].numberInSurah }}"
                    tag="div"
                    active-class="active" class="sura-no mr-auto">
                       <a class="nav-link"><span v-b-tooltip.hover v-bind:title="'Surah:'+ suraMeta[0].number +' Verse:' + value.numberInSurah" class="label label-default" :name="suraMeta[0].number+':'+value.numberInSurah">{{suraMeta[0].number+':'+value.numberInSurah}}</span></a>
                  </router-link>
                <div class="">
                <button
                class="audio"
                v-on:click="play"
                :data-ayah="value.number"
                :key="value.number"
                v-b-tooltip.hover 
                title="Play"
                role="button"
                aria-label="Play Audio"            
                >
                  <i class="quran-icon icon-play">&#xe803;</i>
                </button>

                <button
                  v-clipboard:copy="value.text"
                  v-clipboard:success="handleCopyStatus(true)"
                  v-clipboard:error="handleCopyStatus(false)"
                  v-b-tooltip.hover 
                  title="Copy"
                  role="button"
                  aria-label="Copy"                                  
                ><i class="quran-icon icon-link">&#xe800;</i>
                </button>

                  <!-- <a target="_blank" href="#" class="btn-media twitter">
                    <i class="icon-social-facebook"></i>
                  </a>
                  <a target="_blank" href="#" class="btn-media twitter">
                    <i class="icon-social-twitter"></i>
                  </a>  -->


                <button
                v-on:click="updateFavorites"
                :data-favoriteid="suraMeta[0].number+':'+values[0].numberInSurah"
                v-bind:class="{ favorite: favorites.includes(suraMeta[0].number+':'+values[0].numberInSurah) }"
                v-b-tooltip.hover 
                title="Add Bookmark"
                role="button"
                aria-label="Add Bookmark"                              
                >
                  <i class="quran-icon icon-bookmark-empty">&#xf097;</i>
                </button>

                </div>

            </div>

              <div v-bind:class="[index==0 ? 'text-arabic font-mequran' : 'text-others']">
                <div v-bind:class="'language-type-' + edition[index].language">

                  <h4 v-if="index!=0" class="edition-meta">{{edition[index].englishName}}</h4>

                    <p v-bind:lang="[index==0 ? 'ar' : 'en']" v-bind:dir="[index==0 ? 'rtl' : 'ltr']">
                      <span class="single-ayah">{{value.text}}</span>
                      <span v-if="index==0" v-b-tooltip.hover v-bind:title="'Verse:' + value.numberInSurah" class="ayah-ending">۝
                        <span class="ayah-number">{{value.numberInSurah | arabicLatter}}</span>
                      </span>
                    </p>

                </div>

              </div>
          </div>
      </b-row>
      <div class="row pagination mb-5" v-if="all_done">
        <div class="col-6">        
          <router-link
            v-if="(suraMeta[0].number > 1)"
            :to="{ name: 'Surah', params: { surah_id: parseInt(suraMeta[0].number)-1 }}"
            tag="span"
            active-class="active">
              <a class="nav-link pagination-link"><i class="quran-icon icon-left-open">&#xe808;</i> Previous Surah</a>
          </router-link>
        </div>
        <div class="col-6">
              <router-link
                v-if="(suraMeta[0].number < 114)"
                :to="{ name: 'Surah', params: { surah_id: parseInt(suraMeta[0].number)+1 }}"
                tag="span"
                active-class="active">
                  <a class="nav-link pagination-link">Next Surah <i class="quran-icon icon-right-open">&#xe807;</i></a>
              </router-link>
        </div>
      </div>
        <Loader numbers="3" v-if="loading"/>
      </div>

    </div>

</template>
<script>

const Loader = () => import('@/components/Loader')

import { bus } from '@/main'

let audio = new Audio();

export default {

  name: 'Surah',
  components: {
    Loader,
  },
  data () {
    return {
      loading: false,
      error: null,
      sura: [],
      suraMeta: [],
      edition: [],
      ayahs: [],
      page: 0,
      isLoadMore: false,
      all_done: false,
      identifier_selected: localStorage.getItem('identifier_selected') || [],
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
      player: false,
      isPlaying: false,
      startTime: 0,
      audio_identifier: 'ar.alafasy',
      copySucceeded: null,
      thingToCopy: null,
      limit: 20,
      bottom: false,
    }
  },
  beforeRouteEnter (to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
    //console.log(typeof to.params.surah_id)
    //check if its bad request
    if(to.params.surah_id >= 1 && to.params.surah_id <= 114){
      next()
    }else{
      next({ name: 'not-found' });
    }
    
  },
  beforeRouteUpdate (to, from, next) {
    
    // just use `this`
    this.resetData()

    next()
  },  
  created () {

    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    //For mobile
    window.addEventListener('touchmove', () => {
      this.bottom = this.bottomVisible()
    })

    this.resetData()
    this.getSurahMeta()
    this.fetchData()

    
    bus.$on('identifier_event', obj => {
            // do stuff with obj
            this.identifier_selected = obj
            //console.log(obj)
            this.resetData()
            this.fetchData()
        })
    bus.$on('audio_event', obj => {
            // do stuff with obj
            this.audio_identifier = obj
        })


  },
  methods: {
    bottomVisible() {
      const scrollY = window.scrollY
      const visible = document.documentElement.clientHeight
      const pageHeight = document.documentElement.scrollHeight* 0.9 //if its reach 90% height
      const bottomOfPage = visible + scrollY >= pageHeight
      return bottomOfPage || pageHeight < visible
    },
    resetData(){
      this.error  = null
      this.loading = false
      this.all_done = false
      this.page = 0  
      this.sura = []
      //this.suraMeta = []
    },
    getSurahMeta(){

        this.suraMeta = this.$_.filter(this.surahsJson.data, { 'number': parseInt(this.$route.params.surah_id, 10)})
        //console.log(this.surahsJson.data)
        //console.log(typeof this.$route.params.surah_id)
        //console.log(this.suraMeta)

    },
    fetchData() {

      
      //console.log('fetchData called')
      //console.log(this.bottomVisible())
      //check if its all done
      if(this.all_done){
        //its already running skip
        return;
      }
      //check if its already laoding
      if(this.loading){
        //its already running skip
        return;
      }
      //if surah_id not exsit
      if(!this.$route.params.surah_id){
        return;
      }

      //if this called first time
      if(!this.loading && this.page===0){

        this.resetData()
        this.getSurahMeta()

      }

      //console.log('fetchData running')

      this.loading = true

      let apaiUrl = '/surah/'+this.$route.params.surah_id+'/'+JSON.parse(this.identifier_selected).toString()+'?offset='+this.page+'&limit=' + this.limit;
      //console.log(apaiUrl)

      this.$http.get(apaiUrl)
          .then(({ data }) => {
                //console.log(data)
                if (data.data[0]['ayahs'] instanceof Array) {
                
                    //if this called first time
                    if(this.page===0){

                      //process meta
                      this.suraMeta.push({
                        'numberOfAyahs':             data.data[0]['numberOfAyahs'],
                        'revelationType':            data.data[0]['revelationType'],
                        'number':                    data.data[0]['number'],
                        'name':                      data.data[0]['name'],
                        'englishName':               data.data[0]['englishName'],
                        'englishNameTranslation':    data.data[0]['englishNameTranslation'],
                      })

                    }

                  this.page += this.limit;

                  this.sura.push(...data.data);
                  
                  this.loading = false

 
                }else{
                  //all done
                  this.loading = false
                  this.all_done = true
                  
                }

          })
          .catch(error => {
            this.loading = false
            this.error = error.toString()
          })

    },


    play: function(e) {

      //console.log(e.currentTarget.children[0].classList)

      let $this = e.currentTarget;

      let buttonClass = e.currentTarget.children[0];

      buttonClass.classList.replace('icon-control-play','icon-control-pause')

      this.player = document.getElementById('player')

      let audio_link = 'https://cdn.alquran.cloud/media/audio/ayah/' + this.audio_identifier + '/' + e.currentTarget.getAttribute('data-ayah');
      let source = document.getElementById('audioSource')
      source.src = audio_link


      if(this.isPlaying){

        this.player.pause(); //pause

      }else{

        this.player.load() //load the new source
        this.player.play() //play

      }

      this.player.oncanplay = () => {
          this.currentTime = this.startTime;
          //console.log(this.currentTime)
      }

      this.player.onplaying = () => {
                    this.isPlaying = true;
                    //console.log('onplaying')
                  };

      this.player.onpause = () => {
        this.isPlaying = false;
        //console.log('onpause')

        this.startTime = this.player.currentTime

         buttonClass.classList.replace('icon-control-pause','icon-control-play')

      };

      this.player.addEventListener("ended", function(){
           //console.log('ended')
           buttonClass.classList.replace('icon-control-pause','icon-control-play')
      })

    },
    updateFavorites: function(e) {

      e.currentTarget.classList.add('favorite')

      let id = e.currentTarget.getAttribute('data-favoriteid')

      let index = this.favorites.indexOf(id)

      if(index == -1 ){

        this.favorites.push(id)

      }else{

        // item is already favorite
        this.favorites.splice(index, 1)

      }

      // store array in local storage
      localStorage.setItem('favorites', JSON.stringify(this.favorites));

    },  
    handleCopyStatus(status) {
      this.copySucceeded = status
    },    
  },
  computed: {

    sura_list: function () {

      this.edition = this.$_.map(this.sura, 'edition')

      this.ayahs = this.$_.map(this.sura, 'ayahs')

      this.ayahs = this.$_.flatten(this.ayahs)

      this.ayahs = this.$_.groupBy(this.ayahs, 'number')

      return this.ayahs

    }
  },

  filters: {
      arabicLatter: function(value) {

        if (value == null) {
          return value
        }
        var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        return value.toString().replace(/[0-9]/g, function(w){
         return id[+w]
        });

      }
  },
  watch: {
    '$route': 'fetchData',
    bottom(bottom) {
      if (bottom) {
        this.fetchData()
        //console.log('bottom watch')
        //alert('Bottom watch')
      }
    }
  },  

}
</script>

<style scoped>
.label {
  display: inline;
  padding: 0 .5em;
  line-height: 1;
  color: #939598;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25em;
  font-size: 1rem;
  font-weight: 300;
}
.label-default {
    background-color: #f2f2f2;
}
.sign {
    font-family: times new roman;
    font-size: 0.9em;
    color: #FB7600;
}
</style>
