<template>
  <div class="app">
    <Header />
    <div class="app-body">
    <main class="main">
         <slot />
    </main>
    </div>
    <footer-bar />
  </div>
</template>
<script>
import Header from "@/components/Header";
import FooterBar from "@/components/FooterBar";
export default {
  components: {
    Header,
    FooterBar
  }
};
</script>