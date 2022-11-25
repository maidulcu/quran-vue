<template>
    <TheFooter>
      <!--footer-->
      <b-container>
      <b-row>
        <b-col md="12">
          <b-nav class="ml-1">
            <li><a href="https://learntrueislam.com/">Learn True Islam</a></li>
            <li class="ml-3"><a href="https://learntrueislam.com/privacy-policy/">Privacy</a></li>
          </b-nav>
        </b-col>
      </b-row>
    </b-container>
    </TheFooter>
</template>

<script>
import { Footer as TheFooter } from '@coreui/vue'

export default {
  name: 'Footer',
  components: {
    TheFooter,
  },  
}
</script>
