module Sockets
  class MessagesController < Sockets::ApplicationController
    def new
      puts "New message: #{message[:message]}"

      WebsocketRails[message[:game_id].to_sym]
        .trigger(:new_message, { message: message[:message] } )
    end
  end
end
