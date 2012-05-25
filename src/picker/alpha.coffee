class ColorCanvas.Alpha extends ColorCanvas.Canvas
  className: 'alpha'
  width: 25
  height: 215

  constructor: ->
    super

    @position = new ColorCanvas.Position
    @append(@position)

    @color or= new ColorCanvas.Color.Black
    @setColor(@color)

  render: ->
    @ctx.clearRect(0, 0, @width, @height)

    gradient = @ctx.createLinearGradient(0, 0, 0, @height)
    gradient.addColorStop(0, @color.clone().set(a: 0).toString())
    gradient.addColorStop(1, @color.clone().set(a: 1).toString())

    @ctx.fillStyle = gradient
    @ctx.fillRect(0, 0, @width, @height)

    @position.move(@getCoords())

  setColor: (@color) ->
    @render()

  val: (x, y) ->
     data = @ctx.getImageData(x, y, 1, 1).data
     @color.clone().set(a: Math.round((data[3] / 255) * 100) / 100)

  getCoords: (color = @color) ->
    result =
      left: 0
      top:  Math.round(color.a * @height)

  change: (@color) ->
    @position.move(@getCoords())
    super