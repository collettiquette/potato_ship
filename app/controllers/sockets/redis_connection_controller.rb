module Sockets
  class RedisConnectionController < WebsocketRails::BaseController

    private

    def redis
      WebsocketRails::Synchronization.singleton.redis
    end

  end
end
