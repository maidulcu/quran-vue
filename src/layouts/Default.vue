<template>
  <div class="app">
    <Header />
    <div class="app-body">
      <AppSidebar fixed>
        <SidebarHeader/>
        <Aside/>
      </AppSidebar>        
        <main class="main">
          <b-container>
          <slot />
          </b-container>
        </main>      
      </div>
    <footer-bar />
  </div>
</template>

<script>
import { Sidebar as AppSidebar, SidebarHeader } from '@coreui/vue'
const Header = () => import('@/components/Header')
const Aside = () => import('@/components/Aside')
const FooterBar = () => import('@/components/FooterBar')
export default {
  components: {
    Header,
    Aside,
    FooterBar,
    AppSidebar,
    SidebarHeader,
  }
};
</script>