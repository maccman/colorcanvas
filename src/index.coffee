#= require_self
#= require ./spine
#= require ./color
#= require ./canvas
#= require_tree ./picker
#= require ./picker

@ColorCanvas = (options) ->
  new ColorCanvas.Picker(options)