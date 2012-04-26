Spine    = @ColorCanvas.Spine
Color    = @ColorCanvas.Color
Gradient = @ColorCanvas.Gradient
Spectrum = @ColorCanvas.Spectrum
Alpha    = @ColorCanvas.Alpha
Display  = @ColorCanvas.Display

class @ColorCanvas.Picker extends Spine.Controller
  className: 'colorCanvas'
  width: 425

  constructor: ->
    super
    @color or= new Color(255, 0, 0)
    unless @color instanceof Color
      @color = Color.fromString(@color)
    @original = @color.clone()
    @render()

  render: ->
    @el.empty()

    @gradient = new Gradient(color: @color)
    @spectrum = new Spectrum(color: @color)
    @alpha    = new Alpha(color: @color)
    @display  = new Display(color: @color, original: @original)

    @gradient.bind 'change', (color) =>
      @color.set(color.rgb())
      @display.setColor(@color)
      @alpha.setColor(@color)

      @change()

    @spectrum.bind 'change', (color) =>
      @color.set(color.rgb())
      @gradient.setColor(@color)
      @display.setColor(@color)
      @alpha.setColor(@color)

      @change()

    @alpha.bind 'change', (color) =>
      @color.set(a: color.a)
      @display.setColor(@color)
      @change()

    @display.bind 'change', (color) =>
      @setColor(color)

    @append(@gradient, @spectrum, @alpha, @display)

  setColor: (@color) ->
    @display.setColor(@color)
    @gradient.setColor(@color)
    @spectrum.setColor(@color)
    @alpha.setColor(@color)

    @change()

  change: (color = @color) ->
    @trigger 'change', color

  release: ->
    super

    @gradient.release()
    @spectrum.release()
    @display.release()