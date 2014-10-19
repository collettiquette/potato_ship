module Sockets
  class PlayersController < Sockets::ApplicationController
    def join_game
      puts message[:player_name]
      player = Player.find_by(name: message[:player_name])
      puts "Player connected #{player.name}"
      game = find_game
      game[player.name] = Stat.new(player: player, game_id: game.id)
      games[game.id] = game
      store_games
      trigger_success game_id: game.id, player_name: player.name
    end

    def player_connected
      game = games[message[:game_id]]
      connection_store[:user_id] = message[:player_name]

      obstacles = game.obstacles.map(&:to_h)
      send_message(:include_obstacles, {
        game_id: game.id,
        obstacles: obstacles
      })

      websocket_channel(game.id).trigger(:player_connected, {
        players: game.player_names,
        new_player_name: message[:player_name],
        game_id: game.id
      })


      websocket_channel(game.id).trigger(:new_message, {
        message: "#{message[:player_name]} joined game."
      })
    end

    def client_disconnected
      games.each do |game_id, game|
        stat = game.remove(connection_store[:user_id])

        if stat
          player = stat.player

          websocket_channel(game_id).trigger(:player_disconnected, { player_name: player.name })
          websocket_channel(game_id).trigger(:new_message, { message: "#{player.name} left game." })
          puts "Player #{player.name} disconnected"

          break game
        end
      end
      store_games

    end

    private

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
