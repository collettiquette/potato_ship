// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var Stats = function(dispatcher,channel) {

  var dispatcher, channel

  var update_score = function(game_id,new_score) {

    dispatcher.trigger("update_score", { game_id: game_id, player_id: getCookie('player_id'), score: new_score });
  }

  var update_kills = function(game_id,new_kills) {
    dispatcher.trigger("update_kills", { game_id: game_id, player_id:
    getCookie('player_id'), kills: new_kills });
  }

  var update_deaths = function(game_id,new_deaths) {
    dispatcher.trigger("update_deaths", { game_id: game_id, player_id:
    getCookie('player_id'), deaths: new_deaths })
  }

  return {
    update_score: update_score,
    update_kills: update_kills,
    update_deaths: update_deaths
  }
}
