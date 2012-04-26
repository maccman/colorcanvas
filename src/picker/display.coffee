Color = @ColorCanvas.Color
Spine = @ColorCanvas.Spine

class @ColorCanvas.Display extends Spine.Controller
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
    'change input[name=hex]': 'changeHex'

  constructor: ->
    super
    @color or= new Color(0, 0, 0)
    @render()
    @setColor(@color)

  render: ->
    @html JST['picker/views/display'](this)

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

    color = new Color(
      @$r.val(),
      @$g.val(),
      @$b.val(),
      parseFloat(@$a.val()) / 100
    )

    @trigger 'change', color

  changeHex: (e) ->
    e.preventDefault()

    color = Color.fromHex(@$hex.val())
    @trigger 'change', color