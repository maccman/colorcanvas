Color  = ColorCanvas.Color
Spine  = ColorCanvas.Spine

class ColorCanvas.Canvas extends Spine.Controller
  width: 100
  height: 100

  events:
    'mousedown canvas': 'drag'

  constructor: ->
    super
    @canvas = $('<canvas />')
    @canvas.attr(
      width:  @width,
      height: @height
    )
    @canvas.css(width: @width, height: @height)
    @ctx = @canvas[0].getContext('2d')
    @append(@canvas)

  val: (x, y) ->
     data = @ctx.getImageData(x, y, 1, 1).data
     new Color(r: data[0], g: data[1], b: data[2])

  drag: (e) ->
    @canvas.mousemove(@over)
    $(document).mouseup(@drop)
    @over(e)

  over: (e) =>
    e.preventDefault()

    offset = @canvas.offset()
    x = e.pageX - offset.left
    y = e.pageY - offset.top
    @change(@val(x, y))

  change: (@color) ->
    @trigger 'change', @color

  drop: =>
    @canvas.unbind('mousemove', @over)
    $(document).unbind('mouseup', @drop)

  release: ->
    @drop()
    super