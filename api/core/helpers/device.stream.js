var GPS = require('gps');
var gps = new GPS();

gps.state.bearing = 0;
var prev = {
  lat: null,
  lon: null
};

// var sentence = '*HQ,865205035790970,V1,230749,A,1026.58280,N,07315.70369,W,0.00,0,020819,FFFFFBFF#';
// const sentence1 = '$GPGGA,224900.000,4832.3762,N,00903.5393,E,1,04,7.8,498.6,M,48.0,M,,0000*5E';
// const sentence2 = '#HQ,865205035790970,V1,230749,A,1026.58280,N,07315.70369,W,0.00,0,020819,FFFFFBFF#';
// const sentence3 = '$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A';
// const sentence4 = '13      868789025861484  GPRMC,234130.00,A,1028.35070,N,07316.37370,W,13.070,160.04,020819,,,A*46';
// const sentence5 = '*GS06,358077090900313,234642020819,,SYS:SP4603NS;V3.34;V1.1.8,GPS:A;12;N10.463296;W73.253776;0;0;192;0.69;1.21,COT:26717904,ADC:24.48;3.85,DTT:4000;E0;;;0;1#';

module.exports = sentence => {
  gps.on('data', (parsed) => {
    if (prev.lat !== null && prev.lon !== null) {
      gps.state.bearing = GPS.Heading(prev.lat, prev.lon, gps.state.lat, gps.state.lon);
    }
    prev.lat = gps.state.lat;
    prev.lon = gps.state.lon;

    console.log(gps.state);
    // io.emit('SOCKET_DEVICE_POSITION', gps.state);
  });
  gps.update(sentence);
};
