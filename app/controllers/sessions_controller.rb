class SessionsController < ApplicationController
  skip_before_filter :signed_in?

  def new; end

  def create
    @player = Player.where(name: player_name_param).first_or_create
    session[:player_id] = @player.id
    redirect_to root_path
  end

  private 
    def session_params
      params.require(:sessions).permit(:player_name)
    end

    def player_name_param
      session_params[:player_name]
    end
end
