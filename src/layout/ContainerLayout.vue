<template>
  <div class="page-container">
    <md-app md-mode="fixed">
      <md-app-toolbar class="md-dense" md-elevation="1">
        <div class="md-toolbar-row">
          <h3 class="md-title" style="flex: 1">Celevi</h3>
          <md-button>Refresh</md-button>
          <md-button class="md-primary">Create</md-button>
        </div>
      </md-app-toolbar>
      <md-app-drawer md-permanent="clipped">       
        <SlideXLeftTransition :duration="150" mode="out-in">
          <router-view></router-view>          
        </SlideXLeftTransition>
      </md-app-drawer>
      <md-app-content>
        <gmap-map
          :center="center"
          :zoom="15"
          :options="{
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            disableDefaultUi: false
          }"
          map-type-id="terrain"
          style="width: 100%; height: 550px;">

          <gmap-marker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :title="m.title"
            :clickable="true"
            :draggable="true"
            @click="center=m.position"
          />
        </gmap-map>
      </md-app-content>
    </md-app>
  </div>
</template>
<script>
// :icon="{ url:'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png' }"
import { SlideXLeftTransition } from 'vue2-transitions'
import io from 'socket.io-client'

export default {
  name: 'ContainerLayout',
  data () {
    return {
      show: true,
      socketOne: {},
      socketTwo: {},
      socketThr: {},
      socketF4r: {},
      center: {
        lat: 10.443046666666667,
        lng: -73.26172816666667
      },
      markers: [],
      places: []
    }
  },
  components: {
    SlideXLeftTransition
  },  
  created () {
    this.socketOne = io.connect('ws://192.168.0.61:3001', { transports: ['websocket'] })
    this.socketTwo = io.connect('ws://192.168.0.61:3002', { transports: ['websocket'] })
    // this.socketThr = io.connect('ws://192.168.0.12:3003', { transports: ['websocket'] })
    // this.socketF4r = io.connect('ws://192.168.0.12:3004', { transports: ['websocket'] })
  },
  mounted () {
    var markersFlex = this.markersFlex
    var companyId = this.$route.params.companyId
    var socketOne = this.socketOne

    socketOne.on('connect', function () {
      // Conectado, regístrate para recibir mensajes para este room
      socketOne.emit('room', companyId)
    })
    socketOne.on('SOCKET_DEVICE_POSITION', function (data) {
      console.log(data)
      markersFlex(data)
    })

    socketTwo.on('connect', function () {
      // Conectado, regístrate para recibir mensajes para este room
      socketTwo.emit('room', companyId)
    })
    socketTwo.on('SOCKET_DEVICE_POSITION', function (data) {
      console.log(data)
      markersFlex(data)
    })
  },
  methods: {
    markersFlex ({ link, state }) {
      let vehicleFound = this._.find(this.markers, { title: link.imei })
      if (vehicleFound) {
        this._.remove(this.markers, function (obj) {
          return obj.title === link.imei
        })
      }
      this.markers.push({
        title: link.imei,
        position: { lat: state.lat, lng: state.lon }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-app {
    min-height: 100vh;
    border: 1px solid rgba(#000, .12);
  }

   // Demo purposes only
  .md-drawer {
    width: 30%;
    max-width: calc(100vw - 125px);
  }
  .md-content {
    //height: 100vh;
    display: block;
    overflow: auto;
  }
  .md-app-content {
    padding: 0px;
  }  

</style>
