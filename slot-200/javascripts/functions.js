$(function(){

  var slotMachine = {
    isLaunched: false,

    phraseCombinations: {
      0: [
        'православие',
        'секс',
        'свобода',
        'карты',
        'камень',
        'чемодан',
        'тройка',
        'Ленин',
        'мир',
        'детство',
        'украл',
        'чай',
        'тополиный пух',
        'огонь',
        'первое',
        'лебедь',
        'бульбазавр',
        'вера',
        'кино',
        'мир',
        'послесловие ',
        'перестройка '
      ],
      1: [
        'самодержавие',
        'наркотики',
        'равенство',
        'деньги',
        'ножницы',
        'вокзал',
        'семерка',
        'партия',
        'труд',
        'отрочество',
        'выпил',
        'кофе',
        'жара',
        'вода',
        'второе',
        'рак',
        'чармандер',
        'надежда',
        'вино',
        'дружба',
        'самовозгорание',
        'ускорение'
      ],
      2: [
        'народность',
        'рок-н-ролл',
        'братство',
        'два ствола',
        'бумага',
        'израиль',
        'туз',
        'комсомол',
        'май',
        'юность',
        'в тюрьму',
        'потанцуем',
        'июль',
        'медные трубы',
        'компот',
        'щука',
        'сквиртл',
        'любовь',
        'домино',
        'жвачка',
        'нарядность',
        'гласность'
      ]
    },

    sharePhraseCombinations: [
      'народности',
      'рок-н-ролльности',
      'братности',
      'двуствольности',
      'бумажности',
      'израильности',
      'тузности',
      'комсомольности',
      'майности',
      'юности',
      'втюрьмуйности',
      'потанцуемости',
      'июльности',
      'меднотрубности',
      'компотности',
      'щучности',
      'сквиртлности',
      'любви',
      'доминошности',
      'жвачности',
      'нарядности',
      'гласности'
    ],

    launchCount: 0,

    handleInterval: null,
    lightsInterval: null,

    slotSound: null,
    handleSound: null,
    gooseSound: null,
    lightSound: null,
    printSound: null,
    normalWinSound: null,
    victorySound: null,

    init: function () {
      var that = this;

      $('.slot-machine__block .machine__handle').addClass('handle__ready');

      $('.slots__container ul').jSlots({
        spinner: '.slot-machine__block .machine__handle.handle__ready',
        delay: 500,
        spinStopDelay: 2400,
        time: 3000,
        loops: 4,
        slotItems: that.phraseCombinations,
        correctAttempt: 10,
        onStart: function(){
          $('.slot-machine__block .machine__handle').removeClass('handle__ready');
        },
        beforeEnd: function(){
          that.slotSound.play();
        },
        onEnd: function(finalNumbers){
          clearInterval(that.lightsInterval);
          $('.slot-machine__block .machine__image_head').removeClass('machine__image_head_active');
          $('.slot-machine__block .machine__lights')[0].className = 'machine__lights';

          that.lightSound.stop();

          that.prepareShare(finalNumbers);
          that.showShare(finalNumbers);
        }
      });

      that.prepareSounds();
    },
    prepareSounds: function(){
      this.slotSound = new Howl({
        urls: ['sounds/az-slots-slot1.mp3']
      });

      this.handleSound = new Howl({
        urls: ['sounds/az-slots-handle.mp3']
      });

      this.gooseSound = new Howl({
        urls: ['sounds/az-slots-goose.mp3']
      });

      this.lightSound = new Howl({
        urls: ['sounds/az-slots-music.mp3']
      });

      this.printSound = new Howl({
        urls: ['sounds/az-slots-print.mp3']
      });

      this.victorySound = new Howl({
        urls: ['sounds/az-slots-victorymusic.mp3']
      });

      this.normalWinSound = new Howl({
        urls: ['sounds/az-slots-normalwin.mp3']
      });
    },
    launch: function(){
      if(!this.isLaunched) {
        this.toggleHandle();
        this.toggleGoose();
        this.toggleLights();
      }
    },
    toggleHandle: function(){
      var handleState = 0,
          direction = 'down',
          that = this;

      that.isLaunched = true;

      that.handleSound.play();

      if(that.launchCount > 0) {
        $('.slot-machine__block .machine__paper-share').addClass('machine__paper-rotateFall');
        setTimeout(function(){
          $('.slot-machine__block .machine__paper-share').hide().removeClass('machine__paper-rotateFall');
          setTimeout(function(){
            $('.slot-machine__block .machine__paper-share').show().removeAttr('style');
          }, 1000);
        }, 1000);
      }

      that.handleInterval = setInterval(function(){

        if(direction == 'down' && handleState >= 0 && handleState < 4){
          handleState++;
          if(handleState == 4){
            direction = 'up';
          }
        }else if(direction == 'up' && handleState > 0){
          handleState--;
        }

        $('.slot-machine__block .machine__handle')[0].className = 'machine__handle machine__handle_'+ handleState;

        if(handleState == 0){
          $('.slot-machine__block .machine__handle').removeClass('machine__handle_0');
          clearInterval(that.handleInterval);
        }
      }, 100);
    },
    toggleGoose: function(){
      var that = this;

      that.gooseSound.play();
      $('.slot-machine__block .machine__image_head').addClass('machine__image_head_active');
      setTimeout(function(){
        that.gooseSound.stop();
        $('.slot-machine__block .machine__image_head').removeClass('machine__image_head_active');
      }, 1000);
    },
    toggleLights: function(){
      var lightState = 0,
          that = this;

      setTimeout(function(){
        that.lightSound.play();

        that.lightsInterval = setInterval(function(){
          if(lightState >= 3){
            lightState = 0;
          }
          lightState++;

          $('.slot-machine__block .machine__lights')[0].className = 'machine__lights machine__lights_'+ lightState;
        }, 500);
      }, 500);
    },

    prepareShare: function(finalNumbers){
      var theoryTitleString = 'Вот моя Теория официальной '+ this.sharePhraseCombinations[finalNumbers[2] - 1];

      var imagePart1 = finalNumbers[0] - 1,
          imagePart2 = finalNumbers[1] - 1,
          imagePart3 = finalNumbers[2] - 1;

      var picUrl = encodeURIComponent('875/'+ imagePart1.toString() +'/'+ imagePart2.toString() +'/'+ imagePart3.toString() +'.png'); // Для картинки http://cdn-s-static.arzamas.academy/results/875/0/0/0.jpg, префикс автоматически прибавится на сервере

      var shareText = encodeURIComponent(theoryTitleString);

      var shareUrl = encodeURIComponent('http://arzamas.academy/results/875?pic='+ picUrl +'&text='+ shareText);
      var twitterShareUrl = encodeURIComponent('http://arzamas.academy/results/875?pic='+ picUrl); // текст у твиттера по-другому шерится

      $('.social__item_vk .share-button', '.machine__paper-share').attr('href', 'https://vk.com/share.php?url='+ shareUrl);
      $('.social__item_fb .share-button', '.machine__paper-share').attr('href', 'https://www.facebook.com/sharer/sharer.php?u='+ shareUrl);
      $('.social__item_ok .share-button', '.machine__paper-share').attr('href', 'http://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl='+ shareUrl);
      $('.social__item_tw .share-button', '.machine__paper-share').attr('href', 'https://twitter.com/intent/tweet?text='+ shareText +'&original_referer='+ twitterShareUrl +'&url='+ twitterShareUrl);

      $('.share__title', '.machine__paper-share').html(theoryTitleString);

      $('.wrapper__slot-machine .machine__paper-share').show();

      var that = this;
      $('.machine__paper-share .share-button').off('click').click(function(e) {
        e.preventDefault();
        var $this, href, title;
        $this = $(this);
        href = $this.attr('href');
        title = $this.attr('title');
        that.prepareSharePopup(href, title, 500, 600);
      });
    },

    prepareSharePopup: function(url, title, w, h) {
      var left, top;
      left = screen.width / 2 - (w / 2);
      top = screen.height / 2 - (h / 2);
      return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    },

    showShare: function(finalNumbers){
      var that = this;

      setTimeout(function(){
        if(finalNumbers[0] == finalNumbers[1] && finalNumbers[0] == finalNumbers[2]){
          that.victorySound.play();
        }else{
          that.normalWinSound.play();
        }

        setTimeout(function(){
          that.printSound.play();

          var paperOffsetBottom = 179 - $('.slot-machine__block .machine__paper-share').outerHeight();

          $('.slot-machine__block .machine__paper-share').animate({
            bottom: paperOffsetBottom
          }, {
            duration: 800,
            complete: function(){
              that.isLaunched = false;
              $('.slot-machine__block .machine__handle').addClass('handle__ready');
            }
          });
        }, 1000);
      }, 500);

      this.launchCount++;
    }
  };

  slotMachine.init();

  $('.slot-machine__block .machine__handle').click(function(){
    slotMachine.launch();
  });

  $('.slot-machine__block .machine__image_head').hover(function(){
      slotMachine.gooseSound.play();
  }, function(){
      slotMachine.gooseSound.stop();
  });
});