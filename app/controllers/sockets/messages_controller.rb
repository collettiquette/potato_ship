module Sockets
  class MessagesController < Sockets::ApplicationController
    def new
      WebsocketRails[message[:game_id].to_sym]
        .trigger(:new_message, { message: message[:message] } )
    end
  end
end
