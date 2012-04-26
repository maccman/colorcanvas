Spine = ColorCanvas.Spine

class ColorCanvas.Position extends Spine.Controller
  className: 'position'

  constructor: ->
    super
    @el.css(position: 'absolute')

  move: (coords) ->
    @el.css(coords)