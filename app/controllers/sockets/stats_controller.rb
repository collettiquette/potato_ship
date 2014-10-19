module Sockets
  class StatsController < Sockets::ApplicationController
    def initialize_session
    end

    def update_score
      # Send reswawn signal to clients
      websocket_channel(message[:game_id]).trigger('respawn_ship', message)

      #update scoring player
      score_stat = get_scoring_player_stat
      score_stat.score += 5
      score_stat.kills += 1
      score_stat.save

      #update dead player
      dead_stat = get_dead_player_stat
      dead_stat.deaths += 1
      dead_stat.save
      grab_scores
      if score_stat.kills >= 10
        websocket_channel(message[:game_id]).trigger(:end_game, message)
        websocket_channel(message[:game_id]).trigger(:new_message,
          { message: "Game over" })
        websocket_channel(message[:game_id]).trigger(:new_message,
          { message: "#{message[:player_id]} won!" })
      end
    end

    private

    def grab_scores
      scores = Stat.where(game_id: message[:game_id]).order(score: :desc).map(&:to_h)
      websocket_channel(message[:game_id]).trigger(:update_client_scores, scores)
    end

    def get_scoring_player_stat
      get_player_stat(message[:scoring_player])
    end

    def get_dead_player_stat
      get_player_stat(message[:dead_player])
    end

    def get_player_stat(player_id)
      Stat.where(game_id: message[:game_id], player_id: Player.find_by(name: player_id)).first
    end

  end
end
