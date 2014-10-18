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
      games = JSON.parse(redis[:games])
      game = find_game_by_id(games,message[:game_id])
      return find_stat(game.stats,message[:player_id])
    end

    def find_game_by_id(games,id)
      games.select {|g| Game.parse(g).id == id }
    end

    def find_stat(stats,player_id)
      stats.select {|s| s.player_id == player_id}
    end

  end
end
