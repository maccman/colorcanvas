class @ColorCanvas.Color
  @regex: /(?:#([0-9a-f]{3,6})|rgba?\(([^)]+)\))/i

  @fromHex: (hex) ->
    if hex[0] is '#'
      hex = hex.substring(1, 7)

    if hex.length is 3
      hex = hex.charAt(0) + hex.charAt(0) +
            hex.charAt(1) + hex.charAt(1) +
            hex.charAt(2) + hex.charAt(2)

    r = parseInt(hex.substring(0,2), 16)
    g = parseInt(hex.substring(2,4), 16)
    b = parseInt(hex.substring(4,6), 16)

    new this(r, g, b)

  @fromString: (str) ->
    match = str.match(@regex)
    return null unless match

    if hex = match[1]
      @fromHex(hex)

    else if rgba = match[2]
      [r, g, b, a] = rgba.split(/\s*,\s*/)
      new this(r, g, b, a)

  @White: (alpha) ->
    new Color(255, 255, 255, alpha)

  @Black: (alpha) ->
    new Color(0, 0, 0, alpha)

  @Transparent: ->
    new Color

  constructor: (r, g, b, a = 1) ->
    @r = parseInt(r, 10) if r?
    @g = parseInt(g, 10) if g?
    @b = parseInt(b, 10) if b?
    @a = parseFloat(a)

  toHex: ->
    unless @r? and @g? and @b?
      return 'transparent'

    a = (@b | @g << 8 | @r << 16).toString(16)
    a = '#' + '000000'.substr(0, 6 - a.length) + a
    a.toUpperCase()

  toHSV: ->
    r = @r / 255
    g = @g / 255
    b = @b / 255

    max = Math.max(r, g, b)
    min = Math.min(r, g, b)

    v = max
    d = max - min

    s = (if max is 0 then 0 else d / max)

    if max is min
      h = 0 # achromatic
    else
      switch max
        when r
          h = (g - b) / d + (if g < b then 6 else 0)
        when g
          h = (b - r) / d + 2
        when b
          h = (r - g) / d + 4
      h /= 6

    result =
      h: h
      s: s
      v: v

  isTransparent: ->
    not @a

  set: (values) ->
    @[key] = value for key, value of values
    this

  rgb: ->
    result =
      r: @r
      g: @g
      b: @b

  rgba: ->
    result =
      r: @r
      g: @g
      b: @b
      a: @a

  clone: ->
    new @constructor(@r, @g, @b, @a)

  toString: ->
    if @r? and @g? and @b?
      if @a? and @a isnt 1
        "rgba(#{@r}, #{@g}, #{@b}, #{@a})"
      else
        @toHex()

    else
      'transparent'