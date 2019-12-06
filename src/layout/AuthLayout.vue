<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
import { SlideYUpTransition } from 'vue2-transitions'

export default {
  name: 'auth-layout',
  components: {
    SlideYUpTransition
  },
  data () {
    return {}
  }
}
</script>
<style></style>
