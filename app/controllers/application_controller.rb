class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :signed_in?

  private
    def signed_in?
      unless cookies[:player_id]
        redirect_to new_session_path
      end
    end
end
