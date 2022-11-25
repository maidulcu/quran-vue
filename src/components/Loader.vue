<template>
<div class="row loader">
  <div class='container-loading loading col-12 mb-3 mt-3' v-for="(item, index) in parseInt(numbers)" v-bind:key="index">
   
    <div class="row mb-3 mt-3">
       <div class="col-2"><div class="stripe"></div></div>
      <div class="col-7"></div>
      <div class="col-3"><div class="stripe"></div></div>     
    </div>
    <div class="row mb-3 mt-3">
      <div class="col-12"><div class="stripe"></div></div>     
    </div>   
    <div class="row mb-3 mt-3">
      <div class="col-4"><div class="stripe"></div></div><div class="col-8"></div>  
      <div class="col-12"><div class="stripe"></div></div>
      <div class="col-12"><div class="stripe"></div></div>
      <div class="col-7"><div class="stripe"></div></div>  
      <div class="col-5"></div>    
    </div> 

  </div>
</div>
</template>
<script>
export default {
  name: 'Loader',
  props: ['numbers'],
  data () {
    return {
    }
  },
};
</script>
<style scoped>

.sura-wrapper > .row.loader {
    border-bottom: 0 solid #f1f1f1;
    background: transparent;
    border-radius: 0;
    -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0);

}
.container-loading {
  min-height: 200px;
  width: 100%;
background: #f1f1ec;
border-radius: 5px;
-webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);  
}

.stripe {
  border: 1px solid white;
  height: 25px;
  background-color: #babbbc;
}

.container-loading.loading .stripe {
  animation: hintloading 2s ease-in-out 0s infinite reverse;
  -webkit-animation: hintloading 2s ease-in-out 0s infinite reverse;
}

@keyframes hintloading
{
  0% {
    opacity: 0.5;
  }
  50%  {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

@-webkit-keyframes hintloading
{
  0% {
    opacity: 0.5;
  }
  50%  {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}


</style>