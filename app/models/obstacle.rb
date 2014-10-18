class Obstacle
  FRAMES = ['one']

  attr_reader :x, :y, :frame

  def self.generate
    x = rand(1600)
    y = rand(1200)
    frame = FRAMES.sample
    new(x: x, y: y, frame: frame)
  end

  def initialize(x:, y:, frame:)
    @x = x
    @y = y
    @frame = frame
  end

  def to_h
    { x: x, y: y, frame: frame }
  end
end
