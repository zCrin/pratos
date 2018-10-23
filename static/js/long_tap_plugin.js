/**
 * Title:   jquery.longclick.plugin
 * Link:    https://github.com/kugimiya/jquery.longclick.plugin
 * Author:  Andrey Goncharov, aka @kugimiya
 * Version: 1.1.1
 * License: no license; use as you wish
 */

(function ($) {

  var longTapInstanceLogic = function (options) {
    return function (key, self) {

      var timeout      = options.timeout || 500,
          onStartDelay = options.onStartDelay || 0,
          onEndDelay   = options.onEndDelay || 50,
          mouseEvents  = options.mouseEvents || false,
          touchEvents  = options.touchEvents || false,
          $self        = $(self),
          clickState   = false,
          commonState  = false,
          dummyClick   = false,
          eventState   = '',
          timer,
          onStartTimer;
      
      var timeoutCallback = function (event) {
        if (!commonState) {
          if (options.onSuccess) {
            options.onSuccess(event, $self);
          }
        } else {
          if (options.onReject) {
            options.onReject(event, $self);
          }
        }

        clickState  = (!clickState);
        commonState = (!commonState);

        callOnEnd();
      };

      var onStartDelayCallback = function (event) {
        if (dummyClick) {
          callOnEnd();
          return;
        }

        if (options.onStart) {
          options.onStart(event, $self);
        }

        if (clickState) {
          clickState = (!clickState);
        }

        eventState = 'processing';
        timer      = setTimeout(timeoutCallback, timeout, event);
        clearTimeout(onStartTimer);
      };

      var startEventHandler = function (event) {
        eventState   = 'start';
        onStartTimer = setTimeout(onStartDelayCallback, onStartDelay, event);
      };

      var endEventHandlerLogic = function (event) {
        var canIEndThis = (
          (!clickState) && 
          (
            (typeof(onStartTimer) == typeof(undefined)) ||
            (typeof(timer)        != typeof(undefined))
          )
        );

        if (canIEndThis) {
          callOnEnd();
        }

        clearTimeout(timer);
      }

      var endEventHandler = function (event) {
        setTimeout(endEventHandlerLogic, onEndDelay, event);
      };

      var registerClick = function (event) {
        if (eventState == 'start') {
          dummyClick = true;
        }
      }

      var callOnEnd = function () {
        if (options.onEnd && (dummyClick != true)) {
          options.onEnd(event, $self, commonState);
        }

        dummyClick = false;
        eventState = 'ended';
      }

      if (mouseEvents) {
        $self.on('mousedown', startEventHandler);
        $self.on('mouseup', endEventHandler);
      }

      if (touchEvents) {
        $self.on('touchstart', startEventHandler);
        $self.on('touchend', endEventHandler);
      }

      $self.on('click', registerClick);
    }
  }

  $.fn.longTap = function (options = {
    onStart,
    onSuccess,
    onReject,
    onEnd,
    onStartDelay,
    onEndDelay,
    timeout,
    mouseEvents,
    touchEvents
  }) {
    return this.each(longTapInstanceLogic(options));
  }

})(jQuery);