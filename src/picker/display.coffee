#= require ./views/display

Color    = ColorCanvas.Color
Spine    = ColorCanvas.Spine
template = ColorCanvas['picker/views/display']

class ColorCanvas.Display extends Spine.Controller
  tag: 'article'

  elements:
    'input[name=hex]': '$hex'
    'input[name=r]': '$r'
    'input[name=g]': '$g'
    'input[name=b]': '$b'
    'input[name=a]': '$a'
    '.preview .inner': '$preview'
    '.preview .original': '$original'

  events:
    'change input:not([name=hex])': 'changeInput'
    'keyup input[name=hex]': 'changeHex'
    'submit form': 'changeInput'

  constructor: ->
    super
    @color or= new Color
    @render()
    @setColor(@color)

  render: ->
    @html template(this)

    if @original
      @$original.css(background: @original.toString())

  setColor: (@color) ->
    @$r.val @color.r
    @$g.val @color.g
    @$b.val @color.b

    @$a.val Math.round(@color.a * 100)
    @$hex.val @color.toHex()
    @$preview.css(background: @color.toString())

  changeInput: (e) ->
    e.preventDefault()

    @color = new Color(
      r: @$r.val(),
      g: @$g.val(),
      b: @$b.val(),
      a: parseFloat(@$a.val()) / 100
    )

    @trigger 'change', @color

  changeHex: (e) ->
    e.preventDefault()

    @color = new Color(@$hex.val())

    @$r.val @color.r
    @$g.val @color.g
    @$b.val @color.b

    @$preview.css(background: @color.toString())
    @trigger('change', @color)