<template>
<div class="left-sidebar">

       <b-list-group class="list-group-accent">

        <b-list-group-item class="list-group-item-accent-info bg-light text-left font-weight-bold text-uppercase small">
          Surahs
        </b-list-group-item>


        <hr class="transparent mx-3 my-0">
        
          <router-link v-for="item in surahs" :key="item.number" :to="{ name: 'Surah', params: { surah_id: parseInt(item.number) }}">
            <span class="mr-1">{{item.number}}.</span> <span class="mr-2">{{item.englishName}}</span>
          </router-link>

        </b-list-group>

      </div>
</template>

<script>
import isoLangs from '@/json/_isolangs'

import { bus } from '@/main'

export default {
  name: 'DefaultAside',
  data () {
    return {
      isoLangs: isoLangs.items,
      audio_list: [],
      audio_identifier: '',
      surahs: this.surahsJson.data,
    }
  }, 
  methods: {

    getLanguageName(key) {
        key = key.slice(0,2);
        let lang = this.isoLangs[0][key];
        return lang ? lang.name : undefined;
      },

      updateAudioIdentifier: function() {

        //save audio_identifier on localStorage
        if (localStorage.getItem('audio_identifier')) {
          try {
            this.audio_identifier = localStorage.audio_identifier
          } catch(e) {
            localStorage.removeItem('audio_identifier');
          }
        }else{
          this.audio_identifier = 'ar.alafasy'
          localStorage.setItem('audio_identifier', this.audio_identifier )
        }

      },
      audioEditions: function() {

          this.error = null
          this.audio_list.length = 0

          this.$http.get('/edition/format/audio')
              .then(response => {

                   this.loading = false

                   response.data.data.forEach((value) => {
                     this.audio_list.push({
                       'value': value.identifier,
                       'text': '<span class="identifier-lang">'+this.getLanguageName(value.language)+ '</span> : ' +value.englishName
                     })
                    })



              })
              .catch(error => {
                this.loading = false
                this.error = error.toString()
              })
      },
      handleChange (event) {
        console.log(event)
      this.toggle(event.target.checked);
      },
      scrollHandle (evt) {
      // console.log(evt)
      }
  },
  created: function (){
    
  },   
   computed: {
    psSettings: () => {
      // ToDo: find better rtl fix
      return {
        maxScrollbarLength: 200,
        minScrollbarLength: 40,
        suppressScrollX: getComputedStyle(document.querySelector('html')).direction !== 'rtl',
        wheelPropagation: false,
        interceptRailY: styles => ({ ...styles, height: 0 })
      }
    }
  },  
}
</script>
<style scoped lang="css">
  .scroll-area {
    position: absolute;
    height: 100%;
    margin: auto;
  }
</style>