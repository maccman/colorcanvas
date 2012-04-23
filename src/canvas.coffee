Color  = @ColorCanvas.Color
Spine  = @ColorCanvas.Spine

class @ColorCanvas.Canvas extends Spine.Controller
  tag: 'canvas'
  width: 100
  height: 100

  events:
    'mousedown': 'drag'

  constructor: ->
    super
    @el.attr(
      width:  @width,
      height: @height
    )
    @el.css(width: @width, height: @height)
    @ctx = @el[0].getContext('2d')

  val: (x, y) ->
     data = @ctx.getImageData(x, y, 1, 1).data
     new Color(data[0], data[1], data[2])

  drag: (e) ->
    @el.mousemove(@over)
    $(document).mouseup(@drop)
    @over(e)

  over: (e) =>
    e.preventDefault()

    offset = @el.offset()
    x = e.pageX - offset.left
    y = e.pageY - offset.top
    @trigger('change', @val(x, y))

  drop: =>
    @el.unbind('mousemove', @over)
    $(document).unbind('mouseup', @drop)

  release: ->
    super
    @drop()