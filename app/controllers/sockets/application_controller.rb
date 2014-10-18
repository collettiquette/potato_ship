module Sockets
  class ApplicationController < WebsocketRails::BaseController

    private

    def redis
      WebsocketRails::Synchronization.singleton.redis
    end

  end
end
