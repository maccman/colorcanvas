#= require ./tinycolor

class @ColorCanvas.Color
  @fromString: (str) ->
    new Color(tinycolor(str).toRgb())

  @White: (alpha) ->
    new Color(r: 255, g: 255, b: 255, a: alpha)

  @Black: (alpha) ->
    new Color(r: 0, g: 0, b: 0, a: alpha)

  @Transparent: ->
    new Color

  constructor: (rgb) ->
    @a = 1
    @set(rgb)

  tinycolor: ->
    tinycolor(r: @r, g: @g, b: @b, a: @a)

  toHex: ->
    unless @r? and @g? and @b?
      return 'transparent'
    '#' + @tinycolor().toHex().toUpperCase()

  toHSV: ->
    @tinycolor().toHsv()

  toHSL: ->
    @tinycolor().toHsl()

  toRGB: ->
    result =
      r: @r
      g: @g
      b: @b
      a: @a

  toPure: ->
    h    = @tinycolor().toHsl().h
    pure = tinycolor(h: h, s: 100, l: 50).toRgb()
    new Color(r: pure.r, g: pure.g, b: pure.b)

  isTransparent: ->
    not @a

  set: (rgb) ->
    @r = parseInt(rgb.r, 10) if rgb.r?
    @g = parseInt(rgb.g, 10) if rgb.g?
    @b = parseInt(rgb.b, 10) if rgb.b?
    @a = parseFloat(rgb.a)   if rgb.a?
    this

  clone: ->
    new Color(@toRGB())

  toString: ->
    if @r? and @g? and @b?
      if @a? and @a isnt 1
        "rgba(#{@r}, #{@g}, #{@b}, #{@a})"
      else
        @toHex()

    else
      'transparent'