Color  = @ColorCanvas.Color
Canvas = @ColorCanvas.Canvas

class @ColorCanvas.Alpha extends Canvas
  className: 'alpha'
  width: 25
  height: 250

  constructor: ->
    super
    @color or= new Color(0, 0, 0)
    @setColor(@color)

  render: ->
    @ctx.clearRect(0, 0, @width, @height)

    gradient = @ctx.createLinearGradient(0, 0, 0, @height)
    gradient.addColorStop(0, @color.clone().set(a: 0).toString())
    gradient.addColorStop(0.9, @color.clone().set(a: 1).toString())

    @ctx.fillStyle = gradient
    @ctx.fillRect(0, 0, @width, @height)

  setColor: (@color) ->
    @render()

  val: (x, y) ->
     data = @ctx.getImageData(x, y, 1, 1).data
     @color.set(a: Math.round((data[3] / 255) * 100) / 100)