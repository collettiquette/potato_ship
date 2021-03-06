class SessionsController < ApplicationController
  skip_before_filter :signed_in?

  def new
    @player = Player.new
  end

  def create
    @player = Player.where(name: player_name_param).first_or_initialize
    @player.ship_type = ship_type_param

    if @player.save
      cookies[:player_name] = @player.name
      redirect_to root_path
    else
      render :new
    end
  end

  private
    def session_params
      params.require(:sessions).permit(:player_name, :ship_type)
    end

    def ship_type_param
      session_params[:ship_type]
    end

    def player_name_param
      session_params[:player_name]
    end
end
