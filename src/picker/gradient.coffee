Color = ColorCanvas.Color

class ColorCanvas.Gradient extends ColorCanvas.Canvas
  className: 'gradient'
  width: 250
  height: 215

  constructor: ->
    super

    @position = new ColorCanvas.Position
    @append(@position)

    @color or= new Color.Black
    @setColor(@color)

  setColor: (@color) ->
    @render()

  renderGradient: (xy, colors...) ->
    gradient = @ctx.createLinearGradient(0, 0, xy...)
    gradient.addColorStop(0, colors.shift()?.toString())

    for color, index in colors
      gradient.addColorStop(index + 1 / colors.length, color.toString())

    @ctx.fillStyle = gradient
    @ctx.fillRect(0, 0, @width, @height)

  render: ->
    @ctx.clearRect(0, 0, @width, @height)

    @renderGradient(
      [@width, 0],
      new Color.White,
      new Color.White
    )

    pure = @color.toPure()

    @renderGradient(
      [@width, 0],
      pure.clone().set(a: 0),
      pure.clone().set(a: 1)
    )

    gradient = @ctx.createLinearGradient(0, 0, -6, @height)
    gradient.addColorStop(0, new Color.Black(0).toString())
    gradient.addColorStop(1, new Color.Black(1).toString())
    @ctx.fillStyle = gradient
    @ctx.fillRect(0, 0, @width, @height)

    @position.move(@getCoords())

  getCoords: (color = @color) ->
    hsv = color.toHSV()

    # Invert y, then find percentage
    # of x/y in width/height
    result =
      left: Math.round(@width * hsv.s)
      top:  Math.round(@height * (1 - hsv.v))

  change: (@color) ->
    @position.move(@getCoords())
    super