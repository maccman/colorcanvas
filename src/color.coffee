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

  @fromHSL: (h, s, l) ->
    r = undefined
    g = undefined
    b = undefined

    if s is 0
      r = g = b = l
    else
      hue2rgb = (p, q, t) ->
        t += 1  if t < 0
        t -= 1  if t > 1
        return p + (q - p) * 6 * t  if t < 1 / 6
        return q  if t < 1 / 2
        return p + (q - p) * (2 / 3 - t) * 6  if t < 2 / 3
        p
      q = (if l < 0.5 then l * (1 + s) else l + s - l * s)
      p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)

    new this(r * 255, g * 255, b * 255)

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

    [h, s, v]

  toHSL: ->
    r = @r / 255
    g = @g / 255
    b = @b / 255

    max = Math.max(r, g, b)
    min = Math.min(r, g, b)
    h = undefined
    s = undefined
    l = (max + min) / 2

    if max is min
      h = s = 0

    else
      d = max - min
      s = (if l > 0.5 then d / (2 - max - min) else d / (max + min))
      switch max
        when r
          h = (g - b) / d + (if g < b then 6 else 0)
        when g
          h = (b - r) / d + 2
        when b
          h = (r - g) / d + 4
      h /= 6

    [h, s, l]

  isTransparent: ->
    not @a

  set: (r, g, b, a) ->
    if typeof r is 'object'
      @[key] = value for key, value of r
    else
      @r = r ? @r
      @g = g ? @g
      @b = b ? @b
      @a = a ? @a
    this

  toRGB: ->
    [@r, @g, @b]

  toRGBA: ->
    [@r, @g, @b, @a]

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