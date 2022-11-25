<template>
  <b-tabs>
    <b-tab>
      <template slot="title">
        <i class="quran-icon icon-list">&#xe805;</i>
      </template>

        <VuePerfectScrollbar class="scroll-area" :settings="psSettings" @ps-scroll-y="scrollHandle">

       <b-list-group class="list-group-accent">


        <b-list-group-item class="list-group-item-accent-info bg-light text-center font-weight-bold text-uppercase small">
          Translations
        </b-list-group-item>

      <!-- <b-form-group>
        <b-form-checkbox-group
        v-if="identifier_list.length > 0"
        v-model="identifier_selected"
        :options="identifier_list"
        id="identifier_list"
        class="mb-3"
        switches
        >
        </b-form-checkbox-group>
        </b-form-group> -->

          <b-form-select v-model="identifier_selected" :options="identifier_list" multiple :select-size="4"></b-form-select>

          <hr class="transparent mx-3 my-0">

        </b-list-group>

        </VuePerfectScrollbar>


    </b-tab>

    <b-tab>
      <template slot="title">
        <i class="quran-icon icon-cog">&#xe806;</i>
      </template>

        <b-list-group-item class="list-group-item-accent-info bg-light text-center font-weight-bold text-uppercase small">
          Settings
        </b-list-group-item>
        <div class="p-3">

          <!-- <h6>Audio Settings</h6>

          <b-form-select v-model="audio_identifier" :options="audio_list" class="mb-3" /> -->

        <hr>

        <b-form-checkbox 
        v-model="nightMode"  
        name="check-button"
        v-b-tooltip.hover 
        title="Night Mode" 
         switch>
         Night Mode
        </b-form-checkbox>

        <hr>

        <h6>Fonts</h6>
        <b-form-select v-model="fontFamily" class="mb-3">
          <option value="mequran">MeQuran</option>
          <option value="nh">NooreHidayah</option>
          <option value="othmani">Othmani</option>
          <option value="quran">Quran</option>
          <option value="uthmani">Uthmani</option>
        </b-form-select>
      </div>
    </b-tab>
  </b-tabs>
</template>

<script>
import { Switch as cSwitch } from '@coreui/vue'
import isoLangs from '@/json/_isolangs'

import axios from 'axios'
const baseURL = "https://api.learntrueislam.com/quran/v1"

import VuePerfectScrollbar from 'vue-perfect-scrollbar'
//import VueLodash from 'vue-lodash'


import { bus } from '@/main'

export default {
  name: 'DefaultAside',
  components: {
    cSwitch,
    VuePerfectScrollbar
  },
  data () {
    return {
      identifier_selected: ['quran-simple','en.sahih'],//set default
      isoLangs: isoLangs.items,
      identifier_list: [],
      fontFamily: null,
      audio_list: [],
      audio_identifier: '',
      nightMode: JSON.parse(localStorage.getItem("nightMode")) || false,
    }
  }, 
  methods: {

    getLanguageName(key) {
        key = key.slice(0,2);
        let lang = this.isoLangs[0][key];
        return lang ? lang.name : undefined;
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
      updateFontFamily: function() {

        //save fontFamily on localStorage
        if (localStorage.getItem('fontFamily')) {
          try {
            this.fontFamily = localStorage.fontFamily
          } catch(e) {
            localStorage.removeItem('fontFamily');
          }
        }else{
          this.fontFamily = 'mequran'
          localStorage.setItem('fontFamily', this.fontFamily )
        }

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
      langIdentifiers: function() {

          this.error = null
          this.identifier_list.length = 0

          axios.get('/edition')
              .then(response => {

                   this.loading = false

                   let exclude_translation = ['quran-simple','en.ahmedraza','en.maududi','en.transliteration','en.walk']

                   let lang_grouped = []

                   lang_grouped = this.lodash.orderBy(response.data.data, ['language'], ['asc'])


                   lang_grouped = this.lodash.remove(lang_grouped, obj => !exclude_translation.includes(obj.identifier));

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
      audioEditions: function() {

          this.error = null
          this.audio_list.length = 0

          axios.get('/edition/format/audio')
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
    this.langIdentifiers()
    this.updateIdentifiers()
    this.updateFontFamily()
    //this.updateAudioIdentifier()
    //this.audioEditions()
  },
  watch: {
    fontFamily(value) {

      localStorage.setItem('fontFamily', value)

      bus.$emit('font_event', value)

    },
    identifier_selected(value) {
      
      //get selectd value
      let parsed = JSON.stringify(value)
      let get_identifier = JSON.parse(localStorage.getItem('identifier_selected'))


      // console.log(JSON.parse(parsed))
      // console.log(get_identifier)
      // console.log(this.lodash.isEqual(JSON.parse(parsed),get_identifier))

      //if local storage and slected value is differnet then emit event
      if(!this.lodash.isEqual(JSON.parse(parsed),get_identifier)){
        bus.$emit('identifier_event', parsed)
      }

      //save on local storage
      localStorage.setItem('identifier_selected', parsed)

    },
		nightMode: function(value) {
			localStorage.setItem("nightMode", JSON.stringify(value));
      //console.log('Night Mode: ' + JSON.stringify(this.nightMode))
      bus.$emit('nightmode_event', value)
		}
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