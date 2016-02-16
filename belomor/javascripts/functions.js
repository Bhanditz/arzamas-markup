$(function(){

  var belomorMapRoad = {
    roadPoints: {
      there: [3, 6, 8, 9, 14],
      back: [15, 17],
      therePointStart: 0,
      backPointStart: 0
    },
    direction: 'there',
    pathHeight: {
      there: 0,
      back: 0
    }
  };

  var prevScroll = 0;
  function onBelomorScroll(){
    var scrolled = $(document).scrollTop(),
        direction = scrolled <= prevScroll ? 'up' : 'down',
        belomorRoadHeight = $('.wrapper__belomor').outerHeight();

    if(scrolled >= $('.wrapper__belomor').offset().top){
      if(scrolled + $('.map__left').outerHeight() + 100 >= $('.wrapper__belomor').offset().top + belomorRoadHeight - 50){
        $('.map__left').addClass('map__left_stick-disabled');
      }else{
        $('.map__left').addClass('map__left_stick').removeClass('map__left_stick-disabled');
      }
    }else{
      $('.map__left').removeClass('map__left_stick').removeClass('map__left_stick-disabled');
    }

    if(scrolled > $('[data-key="0"]').offset().top){

      if(belomorMapRoad.roadPoints.therePointStart == 0 && scrolled >= $('[data-key="3"]').offset().top){
        belomorMapRoad.roadPoints.therePointStart = scrolled;
      }

      if(scrolled > $('[data-key="3"]').offset().top && scrolled <= $('[data-key="14"]').offset().top){
        belomorMapRoad.pathHeight.there = ((scrolled - belomorMapRoad.roadPoints.therePointStart) / ($('[data-key="14"]').offset().top - belomorMapRoad.roadPoints.therePointStart)) * 100;
        belomorMapRoad.direction = 'there';
        $('.path__direction_there').css({
          height: belomorMapRoad.pathHeight.there +'%'
        });

        belomorMapRoad.pathHeight.back = 0;
        $('.path__direction_back').css({
          height: belomorMapRoad.pathHeight.back +'%'
        });
      }else{
        if(belomorMapRoad.roadPoints.backPointStart == 0){
          belomorMapRoad.roadPoints.backPointStart = scrolled;
        }
        belomorMapRoad.pathHeight.back = ((scrolled - belomorMapRoad.roadPoints.backPointStart) / ($('[data-key="18"]').offset().top - belomorMapRoad.roadPoints.backPointStart)) * 100;
        belomorMapRoad.direction = 'back';
        $('.path__direction_back').css({
          height: belomorMapRoad.pathHeight.back +'%'
        });
      }
    }else{
      if(direction == 'up'){
        belomorMapRoad.pathHeight.there = 0;
        $('.path__direction_there').css({
          height: belomorMapRoad.pathHeight.there +'%'
        })
      }
    }

    prevScroll = scrolled;
  }

  setTimeout(function(){
    onBelomorScroll();
  }, 500);

  $(window).bind('scroll', function(e){
    onBelomorScroll();
  });
});