$(function(){

  var Portrait = {
    containerSize: {
      width: 0,
      height: 0,

      widthOriginal: 1040,
      heightOriginal: 520
    },

    selectedIndex: null,

    prepareContainer: function(){
      var that = this;

      that.containerSize.width = $('.portrait__container').outerWidth();
      that.containerSize.height = that.containerSize.width / 2;

      $('.portrait__container').css({
        height: that.containerSize.height
      });
    },

    toggleTags: function(){
      $('.portrait__container .tags__container .tag__item').toggleClass('tag__item-toggle');
    },

    showPopup: function(index){
      var selectedTemplate = $('.popup__template-'+ index),
          guyContent = selectedTemplate.html(),
          that = this;

      that.selectedIndex = index;

      if(guyContent){
        that.setHashTag(index);

        $('.popup__container .guy__container').html(guyContent);

        if($('.popup__template').length > 1) {
          $('.popup__container .popup__arrow').fadeIn(400);
        }

        $('.popup__overlay').fadeIn(400);
        $('.popup__container').fadeIn({
          duration: 400,
          queue: false
        });
        $('body').addClass('popup__open');
      }

      $('.popup__close').click(function(){
        $('.popup__overlay').fadeOut(400);
        $('.popup__container').fadeOut({
          duration: 400,
          queue: false,
          complete: function(){
            $('body').removeClass('popup__open');
            $('.popup__container .guy__container').html('');
            that.removeHash();
          }
        });
      });

      $('.popup__container .popup__arrow.popup__arrow-next').click(function(){
        var nextTemplate = selectedTemplate.next('.popup__template');

        if(nextTemplate.length){
          that.selectedIndex++;
        }else{
          that.selectedIndex = 0;
          nextTemplate = $('.popup__template').eq(that.selectedIndex);
        }

        if(nextTemplate.length){
          that.setHashTag(that.selectedIndex);

          selectedTemplate = nextTemplate;
          if(selectedTemplate.length){
            guyContent = selectedTemplate.html();
            if(guyContent){
              $('.popup__container .guy__container').html(guyContent);
            }
          }
        }
      });

      $('.popup__container .popup__arrow.popup__arrow-prev').click(function(){
        var prevTemplate = selectedTemplate.prev('.popup__template');

        if(prevTemplate.length){
          that.selectedIndex--;
        }else{
          that.selectedIndex = $('.popup__template').length - 1;
          prevTemplate = $('.popup__template').eq(that.selectedIndex);
        }

        if(prevTemplate.length){
          that.setHashTag(that.selectedIndex);

          selectedTemplate = prevTemplate;
          if(selectedTemplate.length){
            guyContent = selectedTemplate.html();
            if(guyContent){
              $('.popup__container .guy__container').html(guyContent);
            }
          }
        }
      });

      $('.popup__overlay').click(function(e){
        var target = $(e.target);
        if(!target.closest('.popup__container').length) {
          $('.popup__close').trigger('click');
        }
      });

      $(document).on('keyup', function(e){
        if($('.popup__overlay').is(':visible')) {
          if (e.which == 27) {
            $('.popup__close').trigger('click');
          }
        }
      });
    },
    setHashTag: function(tagIndex){
      var tagElement  = $('.portrait__container .tags__container .tag__item').eq(tagIndex),
          tagHash     = tagElement.data('tag');

      window.location.hash = tagHash;
    },
    removeHash: function () {
      var scrollV, scrollH, loc = window.location;
      if ("pushState" in history) {
        history.pushState("", document.title, loc.pathname + loc.search);
      } else {
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;

        loc.hash = "";

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
      }
    }
  };

  Portrait.prepareContainer();
  $(window).resize(function(){
    Portrait.prepareContainer();
  });

  $('.ico__user-toggle').click(function(){
    $(this).toggleClass('picked');
    Portrait.toggleTags();
  }).hover(function(){
    $('.portrait__container .tags__container .tag__item').addClass('tag__item-active');
  }, function(){
    $('.portrait__container .tags__container .tag__item').removeClass('tag__item-active');
  });

  $('.portrait__container .tags__container .tag__item').hover(function(e){
    var target = $(e.target);
    if(!target.hasClass('tag__inner')) {
      $(this).addClass('tag__item-active');
    }
  }, function(){
    if(!$(this).hasClass('tag__item-toggle')) {
      $(this).removeClass('tag__item-active');
    }
  });

  $('.portrait__container .tags__container .tag__item').click(function(){
    var index = $(this).index();
    Portrait.showPopup(index);
  });

  var selectedTagHash = window.location.hash;
  if(selectedTagHash){
    selectedTagHash = selectedTagHash.substr(1);
    $('.portrait__container .tags__container .tag__item[data-tag="'+ selectedTagHash +'"]').trigger('click');
  }
});