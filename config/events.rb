WebsocketRails::EventMap.describe do
  # You can use this file to map incoming events to controller actions.
  # One event can be mapped to any number of controller actions. The
  # actions will be executed in the order they were subscribed.
  #
  # Uncomment and edit the next line to handle the client connected event:
  #   subscribe :client_connected, :to => Controller, :with_method => :method_name
  #
  # Here is an example of mapping namespaced events:
  #   namespace :product do
  #     subscribe :new, :to => ProductController, :with_method => :new_product
  #   end
  # The above will handle an event triggered on the client like `product.new`.

  subscribe :player_connected, to: Sockets::PlayersController,
                               with_method: :player_connected
  subscribe :client_disconnected, to: Sockets::PlayersController,
                                  with_method: :client_disconnected
  subscribe :include_obstacles, to: Sockets::ObstaclesController,
                                with_method: :include_obstacles
  subscribe :new_message, to: Sockets::MessagesController,
                          with_method: :new
  subscribe :update_ship, to: Sockets::ShipsController,
                          with_method: :update_ship
  subscribe :update_score, to: Sockets::StatsController,
                          with_method: :update_score
  subscribe :update_kills, to: Sockets::StatsController,
                          with_method: :update_kills
  subscribe :update_deaths, to: Sockets::StatsController,
                          with_method: :update_deaths
  subscribe :grab_scores, to: Sockets::StatsController,
                          with_method: :grab_scores

end
