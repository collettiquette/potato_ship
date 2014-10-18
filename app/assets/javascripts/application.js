// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require phaser.min
//= require_tree .
//= require websocket_rails/main


dispatcher = new WebSocketRails(window.location.hostname + ':3218/websocket');
channel = dispatcher.subscribe('da_game');

channel.bind('player_connected', function(data) {
  console.debug('channel event received: ' + data.message);
});

dispatcher.on_open = function(data) {
  console.log('Connection has been established: ', data);
  dispatcher.trigger("player_connected", { connection_id: data.connection_id });
}

