<template>
  <div>
    <md-toolbar class="md-accent md-large" md-elevation="1">
      <div class="md-toolbar-row"></div>
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <md-button @click="$router.go(-1)" class="md-icon-button">
            <md-icon>arrow_back</md-icon>
          </md-button>
          <h3 class="md-title">Title on a second row</h3>
        </div>
      </div>      
    </md-toolbar>
   </div>
</template>
<script>
export default {
  name: 'Home'
}
</script>
<style lang="scss" scoped>
  .md-toolbar + .md-toolbar {
    margin-top: 16px;
  }
</style>
