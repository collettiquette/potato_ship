class SessionsController < ApplicationController
  skip_before_filter :signed_in?

  def new; end

  def create
    @player = Player.find_or_initialize(player_name_param)
    session[:player_id] = @player.id
    redirect_to root_path
  end

  private 
    def player_name_param
      params.require(:player).permit(:name)
    end
end
