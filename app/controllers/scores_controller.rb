class ScoresController < ApplicationController
  def index
    @scores = Player.gather_scores  
    p @scores
  end

end
