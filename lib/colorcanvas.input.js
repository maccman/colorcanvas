(function() {
  var $, Color, Input, Picker, PickerPopup, Popup, Spine,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  $ = jQuery;

  Spine = ColorCanvas.Spine;

  Color = ColorCanvas.Color;

  Picker = ColorCanvas.Picker;

  $.colorcanvas = {};

  $.colorcanvas.replaceInputs = function() {
    return $('input[type=color]').each(function() {
      return (new Input).replace(this);
    });
  };

  $(function() {
    return $.colorcanvas.replaceInputs();
  });

  Popup = (function(_super) {

    __extends(Popup, _super);

    Popup.name = 'Popup';

    Popup.prototype.width = 400;

    Popup.prototype.popupEvents = {
      mousedown: 'listen'
    };

    function Popup() {
      this.drop = __bind(this.drop, this);

      this.drag = __bind(this.drag, this);

      this.listen = __bind(this.listen, this);

      this.close = __bind(this.close, this);

      this.open = __bind(this.open, this);
      Popup.__super__.constructor.apply(this, arguments);
      this.delegateEvents(this.popupEvents);
      this.el.delegate('click', '.close', this.close);
      this.el.addClass('popup');
      this.el.css({
        position: 'absolute'
      });
    }

    Popup.prototype.open = function(position) {
      var left, top;
      if (position == null) {
        position = {
          left: 0,
          top: 0
        };
      }
      left = position.left || position.clientX;
      top = position.top || position.clientY;
      left += 25;
      top -= 5;
      this.el.css({
        left: left,
        top: top
      });
      $('body').append(this.el);
      return $('body').mousedown(this.close);
    };

    Popup.prototype.close = function() {
      $('body').unbind('mousedown', this.close);
      this.release();
      return this.trigger('close');
    };

    Popup.prototype.isOpen = function() {
      return !!this.el.parent().length;
    };

    Popup.prototype.listen = function(e) {
      e.stopPropagation();
      if (e.target !== e.currentTarget) {
        return;
      }
      this.dragPosition = {
        left: e.pageX,
        top: e.pageY
      };
      $(document).mousemove(this.drag);
      return $(document).mouseup(this.drop);
    };

    Popup.prototype.drag = function(e) {
      var difference, offset;
      difference = {
        left: e.pageX - this.dragPosition.left,
        top: e.pageY - this.dragPosition.top
      };
      this.dragPosition = {
        left: e.pageX,
        top: e.pageY
      };
      offset = this.el.offset();
      offset.left += difference.left;
      offset.top += difference.top;
      return this.el.css(offset);
    };

    Popup.prototype.drop = function(e) {
      $(document).unbind('mousemove', this.drag);
      return $(document).unbind('mouseup', this.drop);
    };

    return Popup;

  })(Spine.Controller);

  PickerPopup = (function(_super) {

    __extends(PickerPopup, _super);

    PickerPopup.name = 'PickerPopup';

    PickerPopup.prototype.events = {
      'submit form': 'close',
      'click [data-type=cancel]': 'close'
    };

    function PickerPopup() {
      this.keydown = __bind(this.keydown, this);

      var _this = this;
      PickerPopup.__super__.constructor.apply(this, arguments);
      this.color || (this.color = new Color);
      this.picker = new Picker({
        color: this.color
      });
      this.picker.bind('change', function() {
        return _this.trigger.apply(_this, ['change'].concat(__slice.call(arguments)));
      });
      this.append(this.picker);
    }

    PickerPopup.prototype.open = function() {
      $(document).keydown(this.keydown);
      return PickerPopup.__super__.open.apply(this, arguments);
    };

    PickerPopup.prototype.close = function() {
      $(document).unbind('keydown', this.keydown);
      return PickerPopup.__super__.close.apply(this, arguments);
    };

    PickerPopup.prototype.cancel = function() {
      this.trigger('change', this.picker.original);
      return this.close();
    };

    PickerPopup.prototype.keydown = function(e) {
      switch (e.which) {
        case 27:
          return this.cancel();
      }
    };

    return PickerPopup;

  })(Popup);

  Input = (function(_super) {

    __extends(Input, _super);

    Input.name = 'Input';

    Input.prototype.className = 'colorCanvasInput';

    Input.prototype.events = {
      'click': 'open'
    };

    function Input() {
      Input.__super__.constructor.apply(this, arguments);
      this.input || (this.input = $('<input />'));
      this.color || (this.color = new Color({
        r: 255,
        g: 0,
        b: 0
      }));
      this.render();
    }

    Input.prototype.render = function() {
      return this.el.css({
        background: this.color.toString()
      });
    };

    Input.prototype.replace = function(input) {
      this.input = $(input);
      this.color.set(new Color(this.input.val()));
      this.input.hide();
      this.input.after(this.el);
      return this.input.get(0).type = 'text';
    };

    Input.prototype.open = function() {
      var _this = this;
      if (this.picker && this.picker.isOpen()) {
        this.picker.close();
        return;
      }
      this.picker = new PickerPopup({
        color: this.color
      });
      this.picker.bind('change', function(color) {
        _this.color = color;
        _this.trigger('change', _this.color);
        _this.input.val(_this.color.toString());
        _this.input.change();
        return _this.render();
      });
      return this.picker.open(this.el.offset());
    };

    return Input;

  })(Spine.Controller);

  ColorCanvas.Input = Input;

  ColorCanvas.Popup = Popup;

  ColorCanvas.PickerPopup = PickerPopup;

}).call(this);
