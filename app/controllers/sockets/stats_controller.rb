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
      WebsocketRails[:da_game].trigger(:update_client_scores, scores)
    end

    def get_stat_for_player
      games[message[:game_id]].stats.values.find do |s|
        s.player_id == message[:player_id]
      end
    end

  end
end
