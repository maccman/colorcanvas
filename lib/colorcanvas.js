(function() {

  this.ColorCanvas = function(options) {
    return new ColorCanvas.Picker(options);
  };

}).call(this);
(function() {
  var Controller, Events, Module, Spine, moduleKeywords,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Events = {
    bind: function(ev, callback) {
      var calls, evs, name, _i, _len;
      evs = ev.split(' ');
      calls = this.hasOwnProperty('_callbacks') && this._callbacks || (this._callbacks = {});
      for (_i = 0, _len = evs.length; _i < _len; _i++) {
        name = evs[_i];
        calls[name] || (calls[name] = []);
        calls[name].push(callback);
      }
      return this;
    },
    one: function(ev, callback) {
      return this.bind(ev, function() {
        this.unbind(ev, arguments.callee);
        return callback.apply(this, arguments);
      });
    },
    trigger: function() {
      var args, callback, ev, list, _i, _len, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      ev = args.shift();
      list = this.hasOwnProperty('_callbacks') && ((_ref = this._callbacks) != null ? _ref[ev] : void 0);
      if (!list) {
        return;
      }
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        callback = list[_i];
        if (callback.apply(this, args) === false) {
          break;
        }
      }
      return true;
    },
    unbind: function(ev, callback) {
      var cb, i, list, _i, _len, _ref;
      if (!ev) {
        this._callbacks = {};
        return this;
      }
      list = (_ref = this._callbacks) != null ? _ref[ev] : void 0;
      if (!list) {
        return this;
      }
      if (!callback) {
        delete this._callbacks[ev];
        return this;
      }
      for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
        cb = list[i];
        if (!(cb === callback)) {
          continue;
        }
        list = list.slice();
        list.splice(i, 1);
        this._callbacks[ev] = list;
        break;
      }
      return this;
    }
  };

  moduleKeywords = ['included', 'extended'];

  Module = (function() {

    Module.name = 'Module';

    Module.include = function(obj) {
      var key, value, _ref;
      if (!obj) {
        throw 'include(obj) requires obj';
      }
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this.prototype[key] = value;
        }
      }
      if ((_ref = obj.included) != null) {
        _ref.apply(this);
      }
      return this;
    };

    Module.extend = function(obj) {
      var key, value, _ref;
      if (!obj) {
        throw 'extend(obj) requires obj';
      }
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this[key] = value;
        }
      }
      if ((_ref = obj.extended) != null) {
        _ref.apply(this);
      }
      return this;
    };

    Module.proxy = function(func) {
      var _this = this;
      return function() {
        return func.apply(_this, arguments);
      };
    };

    Module.prototype.proxy = function(func) {
      var _this = this;
      return function() {
        return func.apply(_this, arguments);
      };
    };

    function Module() {
      if (typeof this.init === "function") {
        this.init.apply(this, arguments);
      }
    }

    return Module;

  })();

  Controller = (function(_super) {

    __extends(Controller, _super);

    Controller.name = 'Controller';

    Controller.prototype.eventSplitter = /^(\S+)\s*(.*)$/;

    Controller.prototype.tag = 'div';

    Controller.include(Events);

    function Controller(options) {
      this.release = __bind(this.release, this);

      var key, value, _ref;
      this.options = options;
      _ref = this.options;
      for (key in _ref) {
        value = _ref[key];
        this[key] = value;
      }
      if (!this.el) {
        this.el = document.createElement(this.tag);
      }
      this.el = $(this.el);
      if (this.className) {
        this.el.addClass(this.className);
      }
      if (this.attributes) {
        this.el.attr(this.attributes);
      }
      if (!this.events) {
        this.events = this.constructor.events;
      }
      if (!this.elements) {
        this.elements = this.constructor.elements;
      }
      if (this.events) {
        this.delegateEvents(this.events);
      }
      if (this.elements) {
        this.refreshElements();
      }
      Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.release = function() {
      this.el.remove();
      return this.unbind();
    };

    Controller.prototype.$ = function(selector) {
      return $(selector, this.el);
    };

    Controller.prototype.delegateEvents = function(events) {
      var eventName, key, match, method, selector, _results,
        _this = this;
      _results = [];
      for (key in events) {
        method = events[key];
        if (typeof method !== 'function') {
          method = (function(method) {
            return function() {
              _this[method].apply(_this, arguments);
              return true;
            };
          })(method);
        }
        match = key.match(this.eventSplitter);
        eventName = match[1];
        selector = match[2];
        if (selector === '') {
          _results.push(this.el.bind(eventName, method));
        } else {
          _results.push(this.el.delegate(selector, eventName, method));
        }
      }
      return _results;
    };

    Controller.prototype.refreshElements = function() {
      var key, value, _ref, _results;
      _ref = this.elements;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(this[value] = this.$(key));
      }
      return _results;
    };

    Controller.prototype.html = function(element) {
      this.el.html(element.el || element);
      this.refreshElements();
      return this.el;
    };

    Controller.prototype.append = function() {
      var e, elements, _ref;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      elements = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          e = elements[_i];
          _results.push(e.el || e);
        }
        return _results;
      })();
      (_ref = this.el).append.apply(_ref, elements);
      this.refreshElements();
      return this.el;
    };

    return Controller;

  })(Module);

  Spine = this.ColorCanvas.Spine = {};

  Spine.Controller = Controller;

}).call(this);
(function() {

  this.ColorCanvas.Color = (function() {

    Color.name = 'Color';

    Color.regex = /(?:#([0-9a-f]{3,6})|rgba?\(([^)]+)\))/i;

    Color.fromHex = function(hex) {
      var b, g, r;
      if (hex[0] === '#') {
        hex = hex.substring(1, 7);
      }
      if (hex.length === 3) {
        hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
      }
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
      return new this(r, g, b);
    };

    Color.fromString = function(str) {
      var a, b, g, hex, match, r, rgba, _ref;
      match = str.match(this.regex);
      if (!match) {
        return null;
      }
      if (hex = match[1]) {
        return this.fromHex(hex);
      } else if (rgba = match[2]) {
        _ref = rgba.split(/\s*,\s*/), r = _ref[0], g = _ref[1], b = _ref[2], a = _ref[3];
        return new this(r, g, b, a);
      }
    };

    Color.White = function(alpha) {
      return new Color(255, 255, 255, alpha);
    };

    Color.Black = function(alpha) {
      return new Color(0, 0, 0, alpha);
    };

    Color.Transparent = function() {
      return new Color;
    };

    function Color(r, g, b, a) {
      if (a == null) {
        a = 1;
      }
      if (r != null) {
        this.r = parseInt(r, 10);
      }
      if (g != null) {
        this.g = parseInt(g, 10);
      }
      if (b != null) {
        this.b = parseInt(b, 10);
      }
      this.a = parseFloat(a);
    }

    Color.prototype.toHex = function() {
      var a;
      if (!((this.r != null) && (this.g != null) && (this.b != null))) {
        return 'transparent';
      }
      a = (this.b | this.g << 8 | this.r << 16).toString(16);
      a = '#' + '000000'.substr(0, 6 - a.length) + a;
      return a.toUpperCase();
    };

    Color.prototype.toHSV = function() {
      var b, d, g, h, max, min, r, result, s, v;
      r = this.r / 255;
      g = this.g / 255;
      b = this.b / 255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      v = max;
      d = max - min;
      s = (max === 0 ? 0 : d / max);
      if (max === min) {
        h = 0;
      } else {
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
        }
        h /= 6;
      }
      return result = {
        h: h,
        s: s,
        v: v
      };
    };

    Color.prototype.isTransparent = function() {
      return !this.a;
    };

    Color.prototype.set = function(values) {
      var key, value;
      for (key in values) {
        value = values[key];
        this[key] = value;
      }
      return this;
    };

    Color.prototype.rgb = function() {
      var result;
      return result = {
        r: this.r,
        g: this.g,
        b: this.b
      };
    };

    Color.prototype.rgba = function() {
      var result;
      return result = {
        r: this.r,
        g: this.g,
        b: this.b,
        a: this.a
      };
    };

    Color.prototype.clone = function() {
      return new this.constructor(this.r, this.g, this.b, this.a);
    };

    Color.prototype.toString = function() {
      if ((this.r != null) && (this.g != null) && (this.b != null)) {
        if ((this.a != null) && this.a !== 1) {
          return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
        } else {
          return this.toHex();
        }
      } else {
        return 'transparent';
      }
    };

    return Color;

  })();

}).call(this);
(function() {
  var Color, Spine,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Color = ColorCanvas.Color;

  Spine = ColorCanvas.Spine;

  ColorCanvas.Canvas = (function(_super) {

    __extends(Canvas, _super);

    Canvas.name = 'Canvas';

    Canvas.prototype.width = 100;

    Canvas.prototype.height = 100;

    Canvas.prototype.events = {
      'mousedown canvas': 'drag'
    };

    function Canvas() {
      this.drop = __bind(this.drop, this);

      this.over = __bind(this.over, this);
      Canvas.__super__.constructor.apply(this, arguments);
      this.canvas = $('<canvas />');
      this.canvas.attr({
        width: this.width,
        height: this.height
      });
      this.canvas.css({
        width: this.width,
        height: this.height
      });
      this.ctx = this.canvas[0].getContext('2d');
      this.append(this.canvas);
    }

    Canvas.prototype.val = function(x, y) {
      var data;
      data = this.ctx.getImageData(x, y, 1, 1).data;
      return new Color(data[0], data[1], data[2]);
    };

    Canvas.prototype.drag = function(e) {
      this.canvas.mousemove(this.over);
      $(document).mouseup(this.drop);
      return this.over(e);
    };

    Canvas.prototype.over = function(e) {
      var offset, x, y;
      e.preventDefault();
      offset = this.canvas.offset();
      x = e.pageX - offset.left;
      y = e.pageY - offset.top;
      return this.change(this.val(x, y));
    };

    Canvas.prototype.change = function(color) {
      this.color = color;
      return this.trigger('change', this.color);
    };

    Canvas.prototype.drop = function() {
      this.canvas.unbind('mousemove', this.over);
      return $(document).unbind('mouseup', this.drop);
    };

    Canvas.prototype.release = function() {
      this.drop();
      return Canvas.__super__.release.apply(this, arguments);
    };

    return Canvas;

  })(Spine.Controller);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ColorCanvas.Alpha = (function(_super) {

    __extends(Alpha, _super);

    Alpha.name = 'Alpha';

    Alpha.prototype.className = 'alpha';

    Alpha.prototype.width = 25;

    Alpha.prototype.height = 190;

    function Alpha() {
      Alpha.__super__.constructor.apply(this, arguments);
      this.position = new ColorCanvas.Position;
      this.append(this.position);
      this.color || (this.color = new ColorCanvas.Color(0, 0, 0));
      this.setColor(this.color);
    }

    Alpha.prototype.render = function() {
      var gradient;
      this.ctx.clearRect(0, 0, this.width, this.height);
      gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, this.color.clone().set({
        a: 0
      }).toString());
      gradient.addColorStop(1, this.color.clone().set({
        a: 1
      }).toString());
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
      return this.position.move(this.getCoords());
    };

    Alpha.prototype.setColor = function(color) {
      this.color = color;
      return this.render();
    };

    Alpha.prototype.val = function(x, y) {
      var data;
      data = this.ctx.getImageData(x, y, 1, 1).data;
      return this.color.set({
        a: Math.round((data[3] / 255) * 100) / 100
      });
    };

    Alpha.prototype.getCoords = function(color) {
      var result;
      if (color == null) {
        color = this.color;
      }
      return result = {
        left: 0,
        top: Math.round(color.a * this.height)
      };
    };

    Alpha.prototype.change = function(color) {
      this.color = color;
      this.position.move(this.getCoords());
      return Alpha.__super__.change.apply(this, arguments);
    };

    return Alpha;

  })(ColorCanvas.Canvas);

}).call(this);
(function() {
  var Color, Spine,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Color = this.ColorCanvas.Color;

  Spine = this.ColorCanvas.Spine;

  this.ColorCanvas.Display = (function(_super) {

    __extends(Display, _super);

    Display.name = 'Display';

    Display.prototype.tag = 'article';

    Display.prototype.elements = {
      'input[name=hex]': '$hex',
      'input[name=r]': '$r',
      'input[name=g]': '$g',
      'input[name=b]': '$b',
      'input[name=a]': '$a',
      '.preview .inner': '$preview',
      '.preview .original': '$original'
    };

    Display.prototype.events = {
      'change input:not([name=hex])': 'changeInput',
      'change input[name=hex]': 'changeHex'
    };

    function Display() {
      Display.__super__.constructor.apply(this, arguments);
      this.color || (this.color = new Color(0, 0, 0));
      this.render();
      this.setColor(this.color);
    }

    Display.prototype.render = function() {
      this.html(JST['picker/views/display'](this));
      if (this.original) {
        return this.$original.css({
          background: this.original.toString()
        });
      }
    };

    Display.prototype.setColor = function(color) {
      this.color = color;
      this.$r.val(this.color.r);
      this.$g.val(this.color.g);
      this.$b.val(this.color.b);
      this.$a.val(Math.round(this.color.a * 100));
      this.$hex.val(this.color.toHex());
      return this.$preview.css({
        background: this.color.toString()
      });
    };

    Display.prototype.changeInput = function(e) {
      var color;
      e.preventDefault();
      color = new Color(this.$r.val(), this.$g.val(), this.$b.val(), parseFloat(this.$a.val()) / 100);
      return this.trigger('change', color);
    };

    Display.prototype.changeHex = function(e) {
      var color;
      e.preventDefault();
      color = Color.fromHex(this.$hex.val());
      return this.trigger('change', color);
    };

    return Display;

  })(Spine.Controller);

}).call(this);
(function() {
  var Color,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Color = ColorCanvas.Color;

  ColorCanvas.Gradient = (function(_super) {

    __extends(Gradient, _super);

    Gradient.name = 'Gradient';

    Gradient.prototype.className = 'gradient';

    Gradient.prototype.width = 250;

    Gradient.prototype.height = 190;

    function Gradient() {
      Gradient.__super__.constructor.apply(this, arguments);
      this.position = new ColorCanvas.Position;
      this.append(this.position);
      this.color || (this.color = new Color.Black);
      this.setColor(this.color);
    }

    Gradient.prototype.setColor = function(color) {
      this.color = color;
      return this.render();
    };

    Gradient.prototype.colorWithAlpha = function(a) {
      var color;
      color = this.color.clone();
      color.a = a;
      return color;
    };

    Gradient.prototype.renderGradient = function() {
      var color, colors, gradient, index, xy, _i, _len, _ref, _ref1;
      xy = arguments[0], colors = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      gradient = (_ref = this.ctx).createLinearGradient.apply(_ref, [0, 0].concat(__slice.call(xy)));
      gradient.addColorStop(0, (_ref1 = colors.shift()) != null ? _ref1.toString() : void 0);
      for (index = _i = 0, _len = colors.length; _i < _len; index = ++_i) {
        color = colors[index];
        gradient.addColorStop(index + 1 / colors.length, color.toString());
      }
      this.ctx.fillStyle = gradient;
      return this.ctx.fillRect(0, 0, this.width, this.height);
    };

    Gradient.prototype.render = function() {
      var gradient;
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.renderGradient([this.width, 0], new Color(255, 255, 255), new Color(255, 255, 255));
      this.renderGradient([this.width, 0], this.colorWithAlpha(0), this.colorWithAlpha(1));
      gradient = this.ctx.createLinearGradient(0, 0, -6, this.height);
      gradient.addColorStop(0, new Color(0, 0, 0, 0).toString());
      gradient.addColorStop(1, new Color(0, 0, 0, 1).toString());
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
      return this.position.move(this.getCoords());
    };

    Gradient.prototype.getCoords = function(color) {
      var hsv, result;
      if (color == null) {
        color = this.color;
      }
      hsv = color.toHSV();
      console.log(hsv.h, hsv.s, hsv.v);
      return result = {
        left: Math.round(this.width * hsv.s),
        top: Math.round(this.height * (1 - hsv.v))
      };
    };

    Gradient.prototype.change = function(color) {
      this.color = color;
      this.position.move(this.getCoords());
      return Gradient.__super__.change.apply(this, arguments);
    };

    return Gradient;

  })(ColorCanvas.Canvas);

}).call(this);
(function() {
  var Spine,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Spine = ColorCanvas.Spine;

  ColorCanvas.Position = (function(_super) {

    __extends(Position, _super);

    Position.name = 'Position';

    Position.prototype.className = 'position';

    function Position() {
      Position.__super__.constructor.apply(this, arguments);
      this.el.css({
        position: 'absolute'
      });
    }

    Position.prototype.move = function(coords) {
      return this.el.css(coords);
    };

    return Position;

  })(Spine.Controller);

}).call(this);
(function() {
  var Canvas, Color,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Color = this.ColorCanvas.Color;

  Canvas = this.ColorCanvas.Canvas;

  ColorCanvas.Spectrum = (function(_super) {

    __extends(Spectrum, _super);

    Spectrum.name = 'Spectrum';

    Spectrum.prototype.className = 'spectrum';

    Spectrum.prototype.width = 25;

    Spectrum.prototype.height = 190;

    function Spectrum() {
      Spectrum.__super__.constructor.apply(this, arguments);
      this.position = new ColorCanvas.Position;
      this.append(this.position);
      this.color || (this.color = new Color(0, 0, 0));
      this.setColor(this.color);
    }

    Spectrum.prototype.render = function() {
      var gradient;
      this.ctx.clearRect(0, 0, this.width, this.height);
      gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, 'rgb(255,   0,   0)');
      gradient.addColorStop(0.16, 'rgb(255,   0, 255)');
      gradient.addColorStop(0.33, 'rgb(0,     0, 255)');
      gradient.addColorStop(0.50, 'rgb(0,   255, 255)');
      gradient.addColorStop(0.67, 'rgb(0,   255,   0)');
      gradient.addColorStop(0.83, 'rgb(255, 255,   0)');
      gradient.addColorStop(1, 'rgb(255,   0,   0)');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
      return this.position.move(this.getCoords());
    };

    Spectrum.prototype.setColor = function(color) {
      this.color = color;
      return this.render();
    };

    Spectrum.prototype.getCoords = function(color) {
      var hsv, result;
      if (color == null) {
        color = this.color;
      }
      hsv = color.toHSV();
      return result = {
        left: 0,
        top: Math.round(this.height * (1 - hsv.h))
      };
    };

    Spectrum.prototype.change = function(color) {
      this.color = color;
      this.position.move(this.getCoords());
      return Spectrum.__super__.change.apply(this, arguments);
    };

    return Spectrum;

  })(Canvas);

}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["picker/views/display"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<div class="controls">\n  <form>\n    <label>\n      <span>R</span>\n      <input type="number" min="0" max="255" name="r" required autofocus>\n    </label>\n\n    <label>\n      <span>G</span>\n      <input type="number" min="0" max="255" name="g" required>\n    </label>\n\n    <label>\n      <span>B</span>\n      <input type="number" min="0" max="255" name="b" required>\n    </label>\n\n    <label>\n      <span>A</span>\n      <input type="number" min="0" max="100" step="1" name="a">%\n    </label>\n\n    <label>\n      <span>Hex</span>\n      <input type="text" name="hex">\n    </label>\n\n    <div class="preview">\n      <div class="inner">\n        &nbsp;\n      </div>\n      <div class="original">\n        &nbsp;\n      </div>\n    </div>\n  </form>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() {
  var Alpha, Color, Display, Gradient, Spectrum, Spine,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Spine = this.ColorCanvas.Spine;

  Color = this.ColorCanvas.Color;

  Gradient = this.ColorCanvas.Gradient;

  Spectrum = this.ColorCanvas.Spectrum;

  Alpha = this.ColorCanvas.Alpha;

  Display = this.ColorCanvas.Display;

  this.ColorCanvas.Picker = (function(_super) {

    __extends(Picker, _super);

    Picker.name = 'Picker';

    Picker.prototype.className = 'colorCanvas';

    Picker.prototype.width = 425;

    function Picker() {
      Picker.__super__.constructor.apply(this, arguments);
      this.color || (this.color = new Color(255, 0, 0));
      if (!(this.color instanceof Color)) {
        this.color = Color.fromString(this.color);
      }
      this.original = this.color.clone();
      this.render();
    }

    Picker.prototype.render = function() {
      var _this = this;
      this.el.empty();
      this.gradient = new Gradient({
        color: this.color
      });
      this.spectrum = new Spectrum({
        color: this.color
      });
      this.alpha = new Alpha({
        color: this.color
      });
      this.display = new Display({
        color: this.color,
        original: this.original
      });
      this.gradient.bind('change', function(color) {
        _this.color.set(color.rgb());
        _this.display.setColor(_this.color);
        _this.alpha.setColor(_this.color);
        return _this.change();
      });
      this.spectrum.bind('change', function(color) {
        _this.color.set(color.rgb());
        _this.gradient.setColor(_this.color);
        _this.display.setColor(_this.color);
        _this.alpha.setColor(_this.color);
        return _this.change();
      });
      this.alpha.bind('change', function(color) {
        _this.color.set({
          a: color.a
        });
        _this.display.setColor(_this.color);
        return _this.change();
      });
      this.display.bind('change', function(color) {
        return _this.setColor(color);
      });
      return this.append(this.gradient, this.spectrum, this.alpha, this.display);
    };

    Picker.prototype.setColor = function(color) {
      this.color = color;
      this.display.setColor(this.color);
      this.gradient.setColor(this.color);
      this.spectrum.setColor(this.color);
      this.alpha.setColor(this.color);
      return this.change();
    };

    Picker.prototype.change = function(color) {
      if (color == null) {
        color = this.color;
      }
      return this.trigger('change', color);
    };

    Picker.prototype.release = function() {
      Picker.__super__.release.apply(this, arguments);
      this.gradient.release();
      this.spectrum.release();
      return this.display.release();
    };

    return Picker;

  })(Spine.Controller);

}).call(this);
