module Sockets
  class StatsController < Sockets::ApplicationController
    def initialize_session
    end

    def update_score
      stat = get_stat_for_player
      stat.score = message[:score]
      store_games
      grab_scores
    end

    def update_kills
      stat = get_stat_for_player
      stat.kills = message[:kills]
      store_games
      grab_scores
      if stat.kills >= 10
        websocket_channel(message[:game_id]).trigger(:end_game, message)
        websocket_channel(message[:game_id]).trigger(:new_message,
          { message: "Game over" })
        websocket_channel(message[:game_id]).trigger(:new_message,
          { message: "#{message[:player_id]} won!" })
      end
    end

    def update_deaths
      stat = get_stat_for_player
      stat.deaths = message[:deaths]
      store_games
      grab_scores
    end

    private

    def grab_scores
      game = games[message[:game_id]]
      scores = game.stats.values.map(&:to_h)
      websocket_channel(message[:game_id]).trigger(:update_client_scores, scores)
    end

    def get_stat_for_player
      games[message[:game_id]][message[:player_id]]
    end

  end
end
