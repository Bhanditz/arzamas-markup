/*
 * jQuery jSlots Plugin
 * http://matthewlein.com/jslot/
 * Copyright (c) 2011 Matthew Lein
 * Version: 1.0.2 (7/26/2012)
 * Dual licensed under the MIT and GPL licenses
 * Requires: jQuery v1.4.1 or later
 */

(function($){

  $.jSlots = function(el, options){

    var base = this;

    base.$el = $(el);
    base.el = el;

    base.$el.data("jSlots", base);

    base.init = function() {
      base.options = $.extend({},$.jSlots.defaultOptions, options);
      base.setup();
      base.bindEvents();
    };


    // --------------------------------------------------------------------- //
    // DEFAULT OPTIONS
    // --------------------------------------------------------------------- //

    $.jSlots.defaultOptions = {
      number : 3,          // Number: number of slots
      winnerNumber : 1,    // Number or Array: list item number(s) upon which to trigger a win, 1-based index, NOT ZERO-BASED
      spinner : '',        // CSS Selector: element to bind the start event to
      spinEvent : 'click', // String: event to start slots on this event
      slotItems: null,
      onStart : $.noop,    // Function: runs on spin start,
      onPlay : $.noop,     // Function: runs on spin play,
      beforeEnd : $.noop,  // Function: run on spin end. It is passed (finalNumbers:Array). finalNumbers gives the index of the li each slot stopped on in order.
      onEnd : $.noop,      // Function: run on spin end. It is passed (finalNumbers:Array). finalNumbers gives the index of the li each slot stopped on in order.
      onWin : $.noop,      // Function: run on winning number. It is passed (winCount:Number, winners:Array)
      easing : 'swing',    // String: easing type for final spin
      time : 7000,         // Number: total time of spin animation
      loops : 6,           // Number: times it will spin during the animation
      delay: null,
      spinStopDelay: null,
      correctAttempt: 0
    };

    // --------------------------------------------------------------------- //
    // HELPERS
    // --------------------------------------------------------------------- //

    base.randomRange = function(low, high) {
      return Math.floor( Math.random() * (1 + high - low) ) + low;
    };

    // --------------------------------------------------------------------- //
    // VARS
    // --------------------------------------------------------------------- //

    base.isSpinning = false;
    base.spinSpeed = 0;
    base.winCount = 0;
    base.doneCount = 0;

    base.$liHeight = 0;
    base.$liWidth = 0;

    base.winners = [];
    base.allSlots = [];

    base.playCount = 0;

    // --------------------------------------------------------------------- //
    // FUNCTIONS
    // --------------------------------------------------------------------- //


    base.setup = function() {

      var $list = base.$el;

      base.$wrapper = $list.wrap('<div class="jSlots-wrapper"></div>').parent();

      // clone lists
      for (var i = base.options.number - 1; i >= 0; i--){
        base.allSlots.push( new base.Slot() );
      }

      if(base.options.slotItems){
        base.allSlots.forEach(function(slotElement, index){
          var itemVariants = base.options.slotItems[index],
              variantsList = $(slotElement.el);

          $list = variantsList;

          variantsList.html('').css('position', 'relative');
          itemVariants.forEach(function(item){
            variantsList.append($('<li>'+ item +'</li>'));
          });
        });
      }else{
        $list.css('position', 'relative');
      }

      // set sizes
      var $li = $list.find('li').first();

      base.$liHeight = $li.outerHeight();
      base.$liWidth = $li.outerWidth();

      base.liCount = $list.children().length;

      base.listHeight = base.$liHeight * base.liCount;

      base.increment = (base.options.time / base.options.loops) / base.options.loops;

      // remove original, so it can be recreated as a Slot
      base.$el.remove();
    };

    base.bindEvents = function() {
      $(base.options.spinner).bind(base.options.spinEvent, function(event) {
        if (!base.isSpinning) {
          if(base.options.delay){
            setTimeout(base.playSlots, base.options.delay);
          }else {
            base.playSlots();
          }
        }
      });
    };

    // Slot contstructor
    base.Slot = function() {
      this.spinSpeed = 0;
      this.el = base.$el.clone().appendTo(base.$wrapper)[0];
      this.$el = $(this.el);

      this.$el.wrap('<div class="slot__item"><div class="slot__item_container"></div></div>');

      this.loopCount = 0;
      this.number = 0;
    };


    base.Slot.prototype = {

      // do one rotation
      spinEm : function() {

        var that = this;

        that.$el
          .css( 'top', -base.listHeight )
          .animate( { 'top' : '0px' }, that.spinSpeed, 'linear', function() {
            that.lowerSpeed();
          });

      },

      lowerSpeed : function() {

        this.spinSpeed += base.increment;
        this.loopCount++;

        if ( this.loopCount < base.options.loops ) {

          this.spinEm();

        } else {

          this.finish();

        }
      },

      // final rotation
      finish : function() {

        var that = this;

        var endNum = base.randomRange( 1, base.liCount );
        if(base.correctAttemptIndex && (base.playCount % 10 == 0)){
          endNum = base.correctAttemptIndex;
        }

        if(base.options.correctAttempt > 0 && !base.correctAttemptIndex){
            base.correctAttemptIndex = endNum;
        }

        var finalPos = - ( (base.$liHeight * endNum) - base.$liHeight );
        var finalSpeed = ( (this.spinSpeed * 0.5) * (base.liCount) ) / endNum;

        that.$el
          .css( 'top', -base.listHeight )
          .animate( {'top': finalPos}, finalSpeed, base.options.easing, function() {

            if ( $.isFunction( base.options.beforeEnd ) ) {
              base.options.beforeEnd();
            }

            base.checkWinner(endNum, that);
          });

      }

    };

    base.checkWinner = function(endNum, slot) {

      base.doneCount++;
      // set the slot number to whatever it ended on
      slot.number = endNum;

      // if its in the winners array
      if (
        ( $.isArray( base.options.winnerNumber ) && base.options.winnerNumber.indexOf(endNum) > -1 ) ||
        endNum === base.options.winnerNumber
        ) {

        // its a winner!
        base.winCount++;
        base.winners.push(slot.$el);

      }

      if (base.doneCount === base.options.number) {

        var finalNumbers = [];

        $.each(base.allSlots, function(index, val) {
          finalNumbers[index] = val.number;
        });

        if ( $.isFunction( base.options.onEnd ) ) {
          base.options.onEnd(finalNumbers, slot);
        }

        if ( base.winCount && $.isFunction(base.options.onWin) ) {
          base.options.onWin(base.winCount, base.winners, finalNumbers);
        }

        if(base.options.spinStopDelay){
          setTimeout(function(){
            base.isSpinning = false;
          }, base.options.spinStopDelay);
        }else{
          base.isSpinning = false;
        }
      }
    };


    base.playSlots = function() {

      base.playCount++;

      if(base.options.correctAttempt > 0){
        base.correctAttemptIndex = 0;
      }

      if(base.options.onPlay && $.isFunction(base.options.onPlay)){
        base.options.onPlay();
      }

      base.isSpinning = true;
      base.winCount = 0;
      base.doneCount = 0;
      base.winners = [];

      if ( $.isFunction(base.options.onStart) ) {
        base.options.onStart();
      }

      $.each(base.allSlots, function(index, val) {
        this.spinSpeed = 0;
        this.loopCount = 0;
        this.spinEm();
      });
    };

    base.onWin = function() {
      if ( $.isFunction(base.options.onWin) ) {
        base.options.onWin();
      }
    };


    // Run initializer
    base.init();
  };


  // --------------------------------------------------------------------- //
  // JQUERY FN
  // --------------------------------------------------------------------- //

  $.fn.jSlots = function(options){
    if (this.length) {
      return this.each(function(){
        (new $.jSlots(this, options));
      });
    }
  };

})(jQuery);