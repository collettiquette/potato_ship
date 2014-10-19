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
      controller_store[:games] ||= JSON.parse(redis[:games] ||= {}.to_json)
        .each_with_object({}) do |(game_id, game_hash), result|
          result[game_id.to_i] = Game.parse(game_hash)
        end
    end

    def store_games
      redis[:games] = games.to_json
      controller_store.delete(:games)
    end
  end
end
