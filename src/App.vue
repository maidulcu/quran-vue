<template>
  <div id="quran-app">
    <component :is="layout">
      <router-view/>
    </component>
  </div>
</template>

<script>
const default_layout = "default";
export default {
  name: 'app',
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    }
  },
  created() {
    // nothing defined here (when this.$route.path is other than "/")
    //console.log(this.$route, this.$route.meta.layout);
  },
  updated() {
    // something defined here whatever the this.$route.path
    //console.log(this.$route, this.$route.meta.layout);
    if(this.$route.meta.layout==='default'){

      document.body.classList.remove('aside-menu-lg-show')

    }else{

      document.body.classList.remove('aside-menu-lg-show','sidebar-lg-show')
    }

  }  
}
</script>

<style lang="scss">
  /* Import Bootstrap Vue Styles */
  @import '~bootstrap-vue/dist/bootstrap-vue.css';
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
