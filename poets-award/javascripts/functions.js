window.location.getParameterByName = function (name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

$(function() {

  var writerAward = {
    awardPool: [0, 0, 0, 0, 0],

    checkSelectedWriters: function () {
      var checked = true;
      this.awardPool.forEach(function (item) {
        if (item == 0) {
          checked = false;
        }
      });
      return checked;
    },

    sharedWritersPoolString: '',

    prepareAwardsCompleted: function () {
      var stateItemsString = '';

      this.awardPool.forEach(function (item, index) {
        $('.writer__item_place-' + (index + 1)).clone(true, true).appendTo($('.writers__container_selected'));
        stateItemsString += stateItemsString != '' ? ','+ item : item;
      });

      this.sharedWritersPoolString = stateItemsString;

      $('.writer__item_result').clone(true, true).appendTo($('.writers__container_selected'));
      $('.writer__awards').addClass('writer__awards_completed');

      this.prepareAwardShare();
    },

    recalcCupsPosition: function(){
      var cupContainerOffset = $('.cup__block').offset();

      $('.cup__block .cup__item_dragged').each(function(){
        var $cupItem = $(this),
            itemPlace = $cupItem.data('place'),
            $writerItem = $('.writer__item_place-' + itemPlace);

        var cupSelectedPosTop = $writerItem.offset().top + $('.writer__image', $writerItem).outerHeight() - $('.cup__block').offset().top - $cupItem.outerHeight() - 14;

        $cupItem.css({
          top: cupSelectedPosTop
        });
      });
    },

    prepareAwardShare: function(){
      var shareUrl = 'http://arzamas.academy/results/841?state='+ this.sharedWritersPoolString;
      var shareText = encodeURIComponent(shareUrl +'&text=Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
      $('.award__share').find('.share .social-vk .share-button').attr('href', 'https://vk.com/share.php?url='+ shareText);
      $('.award__share').find('.share .social-fb .share-button').attr('href', 'https://www.facebook.com/sharer/sharer.php?u='+ shareText);
      $('.award__share').find('.share .social-od .share-button').attr('href', 'http://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl='+ shareText);
      $('.award__share').find('.share .social-tw .share-button').attr('href', 'https://twitter.com/intent/tweet?text=Lorem ipsum dolor sit amet.&original_referer='+ shareUrl +'&url='+ shareUrl);

      var that = this;
      $('.award__share .share-button').off('click').click(function(e) {
        e.preventDefault();
        var $this, href, title;
        $this = $(this);
        href = $this.attr('href');
        title = $this.attr('title');
        that.prepareAwardSharePopup(href, title, 500, 600);
      });
    },

    prepareAwardSharePopup: function(url, title, w, h) {
      var left, top;
      left = screen.width / 2 - (w / 2);
      top = screen.height / 2 - (h / 2);
      return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    },

    reset: function(){
      this.awardPool = [0, 0, 0, 0, 0];
      $('.writer__awards').removeClass('writer__awards_completed');
      $('.writers__container_selected').html('');
      window.location.search = '';
      $('.cup__container .cup__item.cup__complete').addClass('cup__disabled');
    },

    checkLocationState: function(){
      var locationState = window.location.getParameterByName('state');
      if (locationState) {
        var stateArray = locationState.split(',');
        if(stateArray.length){
          this.awardPool = stateArray;

          this.awardPool.forEach(function(item, index){
            $('.writer__item').each(function(){
              if($(this).data('writerIndex') == item){
                $(this).addClass('writer__item_selected writer__item_place-' + (index + 1));
              }
            });
          });

          this.prepareAwardsCompleted();
        }
      }
    }
  };

  writerAward.checkLocationState();

  $('.cup__item').not('.cup__complete').draggable({
    revert: 'invalid',
    drag: function(e, el){
      var placeIndex = $(el.helper).data('place');
      if($('.writer__item_place-' + placeIndex).length) {
        $('.writer__item_place-' + placeIndex).droppable('enable');
      }
    }
  });

  $('.writer__item').not('.writer__item_result').droppable({
    drop: function (e, el) {
      var $cupItem = $(el.helper),
        placeIndex = $cupItem.data('place'),

        $writerItem = $(this),
        writerName = $writerItem.data('writerTitle'),
        writerIndex = $writerItem.data('writerIndex'),

        $writerCupCaption = $('<div class="cup__writer"></div>');

      $writerCupCaption.append('<div class="writer__place">' + placeIndex + '</div>');
      $writerCupCaption.append('<div class="writer__title">' + writerName + '</div>');

      var $cupContainer = $cupItem.closest('.cup__container');

      $cupItem.css({
        width: $('img', $cupItem).outerWidth()
      });

      var cupSelectedPosTop = $writerItem.offset().top + $('.writer__image', $writerItem).outerHeight() - $('.cup__block').offset().top - $cupItem.outerHeight() - 14,
          cupSelectedPosLeft = $writerItem.offset().left - $('.writers__container').offset().left + $('.writer__image', $writerItem).outerWidth() - $cupItem.outerWidth() - 14;

      $cupItem.css({
        left: cupSelectedPosLeft,
        top: cupSelectedPosTop,
        position: 'absolute'
      }).addClass('cup__item_dragged');

      writerAward.awardPool[placeIndex - 1] = writerIndex;

      $('.writer__item_place-' + placeIndex).removeClass('writer__item_selected');
      $('.writer__item').removeClass('writer__item_place-' + placeIndex);

      $writerItem.addClass('writer__item_selected writer__item_place-' + placeIndex);
      $writerItem.droppable('disable');

      $('.cup__writer', $cupContainer).remove();
      $cupContainer.append($writerCupCaption).css({
        height: $writerCupCaption.outerHeight()
      });

      if (writerAward.checkSelectedWriters()) {
        $('.cup__container .cup__item.cup__complete').removeClass('cup__disabled');
      }
    }
  });

  $('.cup__container .cup__complete').click(function () {
    if (!$(this).hasClass('cup__disabled')) {
      writerAward.prepareAwardsCompleted();
    }
  });

  $('.award__reset').click(writerAward.reset);

  $(window).scroll(function(){
    var scrolled = $(document).scrollTop();

    if(scrolled >= $('.writer__awards').offset().top){
      if(scrolled + $('.cup__block').outerHeight() + 100 >= $('.writer__awards').offset().top + $('.writer__awards').outerHeight() - 50){
        $('.cup__block').addClass('cup__block_stick-disabled');
      }else {
        $('.cup__block').addClass('cup__block_stick').removeClass('cup__block_stick-disabled');
      }
    }else{
      $('.cup__block').removeClass('cup__block_stick').removeClass('cup__block_stick-disabled');
    }

    writerAward.recalcCupsPosition();
  });
});