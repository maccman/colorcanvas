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

  Spine = ColorCanvas.Spine = {};

  Spine.Controller = Controller;

}).call(this);
// TinyColor.js - <https://github.com/bgrins/TinyColor> - 2011 Brian Grinstead - v0.5

(function(window) {

var trimLeft = /^[\s,#]+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    math = Math,
    mathRound = math.round,
    mathMin = math.min,
    mathMax = math.max,
    mathRandom = math.random,
    parseFloat = window.parseFloat;

function tinycolor (color, opts) {

    // If input is already a tinycolor, return itself
    if (typeof color == "object" && color.hasOwnProperty("_tc_id")) {
       return color;
    }

    var rgb = inputToRGB(color);
    var r = rgb.r,
        g = rgb.g,
        b = rgb.b,
        a = parseFloat(rgb.a),
        roundA = mathRound(100*a) / 100,
        format = rgb.format;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (r < 1) { r = mathRound(r); }
    if (g < 1) { g = mathRound(g); }
    if (b < 1) { b = mathRound(b); }

    return {
        ok: rgb.ok,
        format: format,
        _tc_id: tinyCounter++,
        alpha: a,
        toHsv: function() {
            var hsv = rgbToHsv(r, g, b);
            return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: a };
        },
        toHsvString: function() {
            var hsv = rgbToHsv(r, g, b);
            var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
            return (a == 1) ?
              "hsv("  + h + ", " + s + "%, " + v + "%)" :
              "hsva(" + h + ", " + s + "%, " + v + "%, "+ roundA + ")";
        },
        toHsl: function() {
            var hsl = rgbToHsl(r, g, b);
            return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: a };
        },
        toHslString: function() {
            var hsl = rgbToHsl(r, g, b);
            var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
            return (a == 1) ?
              "hsl("  + h + ", " + s + "%, " + l + "%)" :
              "hsla(" + h + ", " + s + "%, " + l + "%, "+ roundA + ")";
        },
        toHex: function() {
            return rgbToHex(r, g, b);
        },
        toHexString: function() {
            return '#' + rgbToHex(r, g, b);
        },
        toRgb: function() {
            return { r: mathRound(r), g: mathRound(g), b: mathRound(b), a: a };
        },
        toRgbString: function() {
            return (a == 1) ?
              "rgb("  + mathRound(r) + ", " + mathRound(g) + ", " + mathRound(b) + ")" :
              "rgba(" + mathRound(r) + ", " + mathRound(g) + ", " + mathRound(b) + ", " + roundA + ")";
        },
        toName: function() {
            return hexNames[rgbToHex(r, g, b)] || false;
        },
        toFilter: function() {
            var hex = rgbToHex(r, g, b);
            var alphaHex = Math.round(parseFloat(a) * 255).toString(16);
            return "progid:DXImageTransform.Microsoft.gradient(startColorstr=#" +
                alphaHex + hex + ",endColorstr=#" + alphaHex + hex + ")";
        },
        toString: function(format) {
            format = format || this.format;
            var formattedString = false;
            if (format === "rgb") {
                formattedString = this.toRgbString();
            }
            if (format === "hex") {
                formattedString = this.toHexString();
            }
            if (format === "name") {
                formattedString = this.toName();
            }
            if (format === "hsl") {
                formattedString = this.toHslString();
            }
            if (format === "hsv") {
                formattedString = this.toHsvString();
            }

            return formattedString || this.toHexString();
        }
    };
}

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function(color) {
    if (typeof color == "object") {
      var newColor = {};
        for (var i in color) {
          newColor[i] = convertToPercentage(color[i]);
        }
        color = newColor;
    }

    return tinycolor(color);
}

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 255, g: 255, b: 255 };
    var a = 1;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = "rgb";
        }
        else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
            color.s = convertToPercentage(color.s);
            color.v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, color.s, color.v);
            ok = true;
            format = "hsv";
        }
        else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
            color.s = convertToPercentage(color.s);
            color.l = convertToPercentage(color.l);
            var rgb = hslToRgb(color.h, color.s, color.l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}



// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s == 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {
    var r, g, b;

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b) {
    function pad(c) {
        return c.length == 1 ? '0' + c : '' + c;
    }
    var hex = [
        pad(mathRound(r).toString(16)),
        pad(mathRound(g).toString(16)),
        pad(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (hex[0][0] == hex[0][1] && hex[1][0] == hex[1][1] && hex[2][0] == hex[2][1]) {
        return hex[0][0] + hex[1][0] + hex[2][0];
    }

    return hex.join("");
}

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function(color1, color2) {
    if (!color1 || !color2) {
        return false;
    }
    return tinycolor(color1).toHex() == tinycolor(color2).toHex();
};
tinycolor.random = function() {
    return tinycolor.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
    });
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>


tinycolor.desaturate = function (color, amount) {
    var hsl = tinycolor(color).toHsl();
    hsl.s -= ((amount || 10) / 100);
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
};
tinycolor.saturate = function (color, amount) {
    var hsl = tinycolor(color).toHsl();
    hsl.s += ((amount || 10) / 100);
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
};
tinycolor.greyscale = function(color) {
    return tinycolor.desaturate(color, 100);
};
tinycolor.lighten = function(color, amount) {
    var hsl = tinycolor(color).toHsl();
    hsl.l += ((amount || 10) / 100);
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
};
tinycolor.darken = function (color, amount) {
    var hsl = tinycolor(color).toHsl();
    hsl.l -= ((amount || 10) / 100);
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
};
tinycolor.complement = function(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
};


// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

tinycolor.triad = function(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
};
tinycolor.tetrad = function(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
};
tinycolor.splitcomplement = function(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
};
tinycolor.analogous = function(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
    }
    return ret;
};
tinycolor.monochromatic = function(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h, s = hsv.s, v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
};
tinycolor.readable = function(color1, color2) {
    var a = tinycolor(color1).toRgb(), b = tinycolor(color2).toRgb();
    return (
        (b.r - a.r) * (b.r - a.r) +
        (b.g - a.g) * (b.g - a.g) +
        (b.b - a.b) * (b.b - a.b)
    ) > 0x28A4;
};

// Big List of Colors
// ---------
// <http://www.w3.org/TR/css3-color/#svg-color>
var names = tinycolor.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);


// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max) / 100;
    }

    // Handle floating point rounding errors
    if ((math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse an integer into hex
function parseHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0 };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseHex(match[1]),
            g: parseHex(match[2]),
            b: parseHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseHex(match[1] + '' + match[1]),
            g: parseHex(match[2] + '' + match[2]),
            b: parseHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }

    return false;
}

// Everything is ready, expose to window
window.tinycolor = tinycolor;

})(this);
(function() {

  ColorCanvas.Color = (function() {

    Color.name = 'Color';

    Color.White = function(alpha) {
      return new Color({
        r: 255,
        g: 255,
        b: 255,
        a: alpha
      });
    };

    Color.Black = function(alpha) {
      return new Color({
        r: 0,
        g: 0,
        b: 0,
        a: alpha
      });
    };

    Color.Transparent = function() {
      return new Color;
    };

    function Color(rgb) {
      this.set(tinycolor(rgb).toRgb());
    }

    Color.prototype.tinycolor = function() {
      return tinycolor({
        r: this.r,
        g: this.g,
        b: this.b,
        a: this.a
      });
    };

    Color.prototype.toHex = function() {
      return '#' + this.tinycolor().toHex().toUpperCase();
    };

    Color.prototype.toHSV = function() {
      return this.tinycolor().toHsv();
    };

    Color.prototype.toHSL = function() {
      return this.tinycolor().toHsl();
    };

    Color.prototype.toRGB = function() {
      var result;
      return result = {
        r: this.r,
        g: this.g,
        b: this.b
      };
    };

    Color.prototype.toRGBA = function() {
      var result;
      return result = {
        r: this.r,
        g: this.g,
        b: this.b,
        a: this.a
      };
    };

    Color.prototype.toPure = function() {
      var h, pure;
      h = this.tinycolor().toHsl().h;
      pure = tinycolor({
        h: h,
        s: 100,
        l: 50
      }).toRgb();
      return new Color({
        r: pure.r,
        g: pure.g,
        b: pure.b
      });
    };

    Color.prototype.isTransparent = function() {
      return !this.a;
    };

    Color.prototype.set = function(rgb) {
      if (rgb.r != null) {
        this.r = parseInt(rgb.r, 10);
      }
      if (rgb.g != null) {
        this.g = parseInt(rgb.g, 10);
      }
      if (rgb.b != null) {
        this.b = parseInt(rgb.b, 10);
      }
      if (rgb.a != null) {
        this.a = parseFloat(rgb.a);
      }
      if (isNaN(this.a)) {
        this.a = 1;
      }
      return this;
    };

    Color.prototype.clone = function() {
      return new Color(this.toRGB());
    };

    Color.prototype.toString = function() {
      if ((this.a != null) && this.a !== 1) {
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
      } else {
        return this.toHex();
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
      return new Color({
        r: data[0],
        g: data[1],
        b: data[2]
      });
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

    Alpha.prototype.height = 215;

    function Alpha() {
      Alpha.__super__.constructor.apply(this, arguments);
      this.position = new ColorCanvas.Position;
      this.append(this.position);
      this.color || (this.color = new ColorCanvas.Color.Black);
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
      return this.color.clone().set({
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
  this.ColorCanvas || (this.ColorCanvas = {});
  this.ColorCanvas["picker/views/display"] = function(__obj) {
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
      
        __out.push('<div class="controls">\n  <form>\n    <label>\n      <span>R</span>\n      <input type="number" min="0" max="255" name="r" required autofocus>\n    </label>\n\n    <label>\n      <span>G</span>\n      <input type="number" min="0" max="255" name="g" required>\n    </label>\n\n    <label>\n      <span>B</span>\n      <input type="number" min="0" max="255" name="b" required>\n    </label>\n\n    <label>\n      <span>A</span>\n      <input type="number" min="0" max="100" step="1" name="a">%\n    </label>\n\n    <label>\n      <span>Hex</span>\n      <input type="text" name="hex">\n    </label>\n\n    <div class="preview">\n      <div class="inner">\n        &nbsp;\n      </div>\n      <div class="original">\n        &nbsp;\n      </div>\n    </div>\n\n    <footer>\n      <button data-type="cancel">Cancel</button>\n      <button data-type="save" class="right">Save</button>\n    </footer>\n  </form>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() {
  var Color, Spine, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Color = ColorCanvas.Color;

  Spine = ColorCanvas.Spine;

  template = ColorCanvas['picker/views/display'];

  ColorCanvas.Display = (function(_super) {

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
      'keyup input[name=hex]': 'changeHex',
      'submit form': 'changeInput'
    };

    function Display() {
      Display.__super__.constructor.apply(this, arguments);
      this.color || (this.color = new Color);
      this.render();
      this.setColor(this.color);
    }

    Display.prototype.render = function() {
      this.html(template(this));
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
      e.preventDefault();
      this.color = new Color({
        r: this.$r.val(),
        g: this.$g.val(),
        b: this.$b.val(),
        a: parseFloat(this.$a.val()) / 100
      });
      return this.trigger('change', this.color);
    };

    Display.prototype.changeHex = function(e) {
      e.preventDefault();
      this.color = new Color(this.$hex.val());
      this.$r.val(this.color.r);
      this.$g.val(this.color.g);
      this.$b.val(this.color.b);
      this.$preview.css({
        background: this.color.toString()
      });
      return this.trigger('change', this.color);
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

    Gradient.prototype.height = 215;

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
      var gradient, pure;
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.renderGradient([this.width, 0], new Color.White, new Color.White);
      pure = this.color.toPure();
      this.renderGradient([this.width, 0], pure.clone().set({
        a: 0
      }), pure.clone().set({
        a: 1
      }));
      gradient = this.ctx.createLinearGradient(0, 0, -6, this.height);
      gradient.addColorStop(0, new Color.Black(0).toString());
      gradient.addColorStop(1, new Color.Black(1).toString());
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

  Color = ColorCanvas.Color;

  Canvas = ColorCanvas.Canvas;

  ColorCanvas.Spectrum = (function(_super) {

    __extends(Spectrum, _super);

    Spectrum.name = 'Spectrum';

    Spectrum.prototype.className = 'spectrum';

    Spectrum.prototype.width = 25;

    Spectrum.prototype.height = 215;

    function Spectrum() {
      Spectrum.__super__.constructor.apply(this, arguments);
      this.position = new ColorCanvas.Position;
      this.append(this.position);
      this.color || (this.color = new Color);
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
        top: Math.round(this.height * (1 - hsv.h / 360))
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
  var Alpha, Color, Display, Gradient, Spectrum, Spine,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Spine = ColorCanvas.Spine;

  Color = ColorCanvas.Color;

  Gradient = ColorCanvas.Gradient;

  Spectrum = ColorCanvas.Spectrum;

  Alpha = ColorCanvas.Alpha;

  Display = ColorCanvas.Display;

  ColorCanvas.Picker = (function(_super) {

    __extends(Picker, _super);

    Picker.name = 'Picker';

    Picker.prototype.className = 'colorCanvas';

    Picker.prototype.events = {
      'click [data-type=cancel]': 'cancel'
    };

    function Picker() {
      Picker.__super__.constructor.apply(this, arguments);
      this.color || (this.color = new Color({
        r: 255,
        g: 0,
        b: 0
      }));
      if (!(this.color instanceof Color)) {
        this.color = new Color(this.color);
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
        _this.color.set(color.toRGB());
        _this.display.setColor(_this.color);
        _this.alpha.setColor(_this.color);
        return _this.change();
      });
      this.spectrum.bind('change', function(color) {
        var hsv;
        hsv = _this.color.toHSV();
        hsv.h = color.toHSV().h;
        color = new Color(hsv);
        _this.color.set(color.toRGB());
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
        _this.color.set(color.toRGBA());
        _this.gradient.setColor(_this.color);
        _this.spectrum.setColor(_this.color);
        _this.alpha.setColor(_this.color);
        return _this.change();
      });
      return this.append(this.gradient, this.spectrum, this.alpha, this.display);
    };

    Picker.prototype.cancel = function(e) {
      e.preventDefault();
      return this.change(this.original);
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
