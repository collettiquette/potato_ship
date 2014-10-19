// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var Stats = function(dispatcher,channel) {

  var dispatcher, channel, $scores = $("#score-container");

  var update_score = function(game_id,player_id,new_score) {
    dispatcher.trigger("update_score", { game_id: game_id, player_id: player_id, score: new_score });
  }

  var update_kills = function(game_id,player_id,new_kills) {
    dispatcher.trigger("update_kills", { game_id: game_id, player_id: player_id, kills: new_kills });
  }

  var update_deaths = function(game_id,player_id,new_deaths) {
    dispatcher.trigger("update_deaths", { game_id: game_id, player_id: player_id, deaths: new_deaths });
  }

  var grab_scores = function(game_id) {
    dispatcher.trigger("grab_scores", { game_id: game_id });
  }

  channel.bind('update_client_scores', function (data) {
    $scores.empty();
    $.each(data, function(index) {
      $scores.append("<tr>");
        $scores.append("<td>" + this.player_name + "</td>");
        $scores.append("<td>" + this.score     + "</td>");
        $scores.append("<td>" + this.kills     + "</td>");
        $scores.append("<td>" + this.deaths    + "</td>");
      $scores.append("</tr>");
    });
  });

  return {
    update_score: update_score,
    update_kills: update_kills,
    update_deaths: update_deaths,
    grab_scores: grab_scores
  }
}
