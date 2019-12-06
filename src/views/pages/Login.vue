<template>
  <div class="md-layout md-gutter md-alignment-center">
    <div class="md-layout-item md-medium-size-33"></div>
    <div class="md-layout-item md-medium-size-33 md-small-size-100">
      <form novalidate class="md-layout" @submit.prevent="validateUser">
        <md-card>
          <md-card-header>
            <div class="md-title">Login</div>
            <div class="md-subhead">Sign In to your account</div>
          </md-card-header>

          <md-card-content>
            <md-field md-clearable>
              <label>Username</label>
              <md-input v-model="model.username"></md-input>
            </md-field>

            <md-field>
              <label>Password</label>
              <md-input v-model="model.password" type="password"></md-input>
            </md-field>
          </md-card-content>

          <md-progress-bar md-mode="indeterminate" v-if="sending" />

          <md-card-actions>
            <md-button type="submit" class="md-raised md-primary" :disabled="sending">Login</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
    <div class="md-layout-item md-medium-size-33"></div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      model: {
        username: 'mluffy',
        password: 'Mugiwara'
      },
      sending: false
    }
  },
  methods: {
    ...mapActions('account', ['login']),
    loadRegisterView () {
      this.$router.push({ name: 'register' })
    },
    validateUser (e) {
      this.submitted = true
      this.login(this.model)
    }
  }
}
</script>
<style lang="scss" scoped>
  .md-card {
    width: 320px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
</style>
