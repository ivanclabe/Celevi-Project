<template>
  <div>
    <md-toolbar md-elevation="1">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <md-button class="md-icon-button">
            <md-icon>home</md-icon>
          </md-button>
        </div>
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" @click="$router.push({ name: 'Resources' })">
            <md-icon>link</md-icon>
          </md-button>
          <md-menu md-size="medium" md-align-trigger>
            <md-button class="md-icon-button" md-menu-trigger>
              <md-icon>more_vert</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item>My Item 1</md-menu-item>
              <md-menu-item>My Item 2</md-menu-item>
              <md-menu-item>My Item 3</md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>
      </div>
    </md-toolbar>
    <md-tabs class="md-transparent" md-alignment="fixed">
      <md-tab id="tab-home" md-label="Home"></md-tab>
      <md-tab id="tab-pages" md-label="Pages"></md-tab>
    </md-tabs>    
    <md-list class="md-triple-line md-dense">
      <md-subheader>Dispositivos</md-subheader>
      <md-list-item to="/components/list" >
        <div class="md-list-item-text">
          <span>Ali Connors</span>
          <span>Brunch this weekend?</span>
          <p>I'll be in your neighborhood doing errands this week. Do you want to meet?</p>
        </div>
      </md-list-item>

      <md-divider></md-divider>

      <md-list-item>
        <div class="md-list-item-text">
          <span>me, Scott, Jennifer</span>
          <span>Summer BBQ</span>
          <p>Wish I could come, but I'm out of town this week. :(</p>
        </div>
      </md-list-item>

      <md-divider></md-divider>

      <md-list-item to="/components/list" >
        <div class="md-list-item-text">
          <span>Sandra Adams</span>
          <span>Oui oui</span>
          <p>Do you have Paris recommendations? Have you visited good places?</p>
        </div>
      </md-list-item>

      <md-divider></md-divider>

      <md-list-item>
        <div class="md-list-item-text">
          <span>Trevor Hansen</span>
          <span>Order confirmation</span>
          <p>Thank you for your recent order from Amazon</p>
        </div>
      </md-list-item>

      <md-divider></md-divider>

      <md-list-item>
        <div class="md-list-item-text">
          <span>Ali Connors</span>
          <span>Brunch this weekend?</span>
          <p>I'll be in your neighborhood doing errands this week. Do you want to meet?</p>
        </div>
      </md-list-item>

      <md-divider></md-divider>

      <md-list-item>
        <div class="md-list-item-text">
          <span>me, Scott, Jennifer</span>
          <span>Summer BBQ</span>
          <p>Wish I could come, but I'm out of town this week. :(</p>
        </div>
      </md-list-item>
    </md-list>
  </div>
</template>
<script>
export default {
  name: 'Home'
}
</script>
