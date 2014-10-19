class HistoricalScoresController < ApplicationController
  def index
    @scores = Player.gather_scores
  end

end
