// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var Stats = function(dispatcher,channel) {

  var dispatcher, channel, $scores = $("#score-container");

  var update_score = function(game_id,scoring_player_id,dead_player_id) {
    dispatcher.trigger("update_score",
    { game_id: game_id,
      scoring_player: scoring_player_id,
      dead_player: dead_player_id }
    );
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
    grab_scores: grab_scores
  }
}
