module Sockets
  class ApplicationController < WebsocketRails::BaseController

    private

    def websocket_channel(game_id)
      WebsocketRails["game_#{game_id}"]
    end

    def redis
      WebsocketRails::Synchronization.singleton.redis
    end

    def games
      p redis[:games]
      p JSON.parse(redis[:games])
      @games ||= JSON.parse(redis[:games] ||= {}.to_json)
        .each_with_object({}) do |(game_id, game_hash), result|
          result[game_id.to_i] = Game.parse(game_hash)
        end
    end

    def store_games
      redis[:games] = games.to_json
    end
  end
end
