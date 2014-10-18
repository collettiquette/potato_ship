module Sockets
  class StatsController < Sockets::ApplicationController
    def initialize_session
    end

    def update_score
      get_stat_for_player.score = message[:score]
    end

    def update_kills
      get_stat_for_player.kills = message[:score]
    end

    def update_deaths
      get_stat_for_player.deaths = message[:score]
    end

    private

    def get_stat_for_player
      return games[message[:game_id]][client_id]
    end

  end
end
