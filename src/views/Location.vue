<template>
  <div>
    <gmap-map
      :center="center"
      :zoom="15"
      :options="{
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: false
      }"
      map-type-id="terrain"
      style="width: 100%; height: 600px;">

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
  </div>
</template>
<script>
// :icon="{ url:'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png' }"

import io from 'socket.io-client'
export default {
  name: 'dashboard',
  data () {
    return {
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
  created () {
    this.socketOne = io.connect('ws://192.168.0.12:3001', { transports: ['websocket'] })
    // this.socketTwo = io.connect('ws://192.168.0.12:3002', { transports: ['websocket'] })
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
