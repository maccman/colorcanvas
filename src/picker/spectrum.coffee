Color  = ColorCanvas.Color
Canvas = ColorCanvas.Canvas

class ColorCanvas.Spectrum extends Canvas
  className: 'spectrum'
  width: 25
  height: 215

  constructor: ->
    super

    @position = new ColorCanvas.Position
    @append(@position)

    @color or= new Color
    @setColor(@color)

  render: ->
    @ctx.clearRect(0, 0, @width, @height)

    gradient = @ctx.createLinearGradient(0, 0, 0, @height)
    gradient.addColorStop(0,    'rgb(255,   0,   0)')
    gradient.addColorStop(0.16, 'rgb(255,   0, 255)')
    gradient.addColorStop(0.33, 'rgb(0,     0, 255)')
    gradient.addColorStop(0.50, 'rgb(0,   255, 255)')
    gradient.addColorStop(0.67, 'rgb(0,   255,   0)')
    gradient.addColorStop(0.83, 'rgb(255, 255,   0)')
    gradient.addColorStop(1,    'rgb(255,   0,   0)')

    @ctx.fillStyle = gradient
    @ctx.fillRect(0, 0, @width, @height)

    @position.move(@getCoords())

  setColor: (@color) ->
    @render()

  getCoords: (color = @color) ->
    hsv = color.toHSV()
    result =
      left: 0
      top:  Math.round(@height * (1 - hsv.h / 360))

  change: (@color) ->
    @position.move(@getCoords())
    super