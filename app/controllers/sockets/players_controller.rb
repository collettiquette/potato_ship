module Sockets
  class PlayersController < WebsocketRails::BaseController
    def initialize_session
      puts 'Initializing session'
    end

    def player_connected
      player = Player.find(message[:player_id])
      puts "Player connected #{player.name}"
      game = find_game
      game[client_id] = Stat.new(player: player, game_id: game.id)
      p client_id
      games[game.id] = game
      store_games
      WebsocketRails[:da_game].trigger(:player_connected, { players: game.player_names } )
    end

    def client_disconnected
      puts "Player #{client_id} disconnected"
      games.each do |game_id, game|
        if game.remove(client_id)
          break game
        end
      end
      store_games
      puts "#{client} removed"
      WebsocketRails[:da_game].trigger(:player_disconnected, {})
    end

    private

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

    def find_game
      games.each do |game_id, game|
        unless game.full?
          return games.delete(game_id)
        end
      end
      Game.new((games.keys.max || 0) + 1)
    end
  end
end
