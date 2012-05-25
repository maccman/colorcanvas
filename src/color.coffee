#= require ./tinycolor

class ColorCanvas.Color
  @White: (alpha) ->
    new Color(r: 255, g: 255, b: 255, a: alpha)

  @Black: (alpha) ->
    new Color(r: 0, g: 0, b: 0, a: alpha)

  @Transparent: ->
    new Color

  constructor: (rgb) ->
    @set(tinycolor(rgb).toRgb())

  tinycolor: ->
    tinycolor(r: @r, g: @g, b: @b, a: @a)

  toHex: ->
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

  toRGBA: ->
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
    @a = parseFloat(rgb.a) if rgb.a?
    @a = 1 if isNaN(@a)
    this

  clone: ->
    new Color(@toRGB())

  toString: ->
    if @a? and @a isnt 1
      "rgba(#{@r}, #{@g}, #{@b}, #{@a})"
    else
      @toHex()