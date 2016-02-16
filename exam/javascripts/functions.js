$(function(){

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function declOfNum(number, textVariants) {
    var cases = [2, 0, 1, 1, 1, 2];
    return textVariants[(number % 100 > 4 && number % 100 < 20 ? 2 : cases[(number % 10 < 5 ? number % 10 : 5)])];
  }

  function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  $.fn.textWidth = function() {
    $("span.input-responsive-width").remove();
    var html_org = $(this).val();

    var html_calc = "<span class=\"input-responsive-width\">" + html_org + "</span>";
    $(this).after(html_calc);
    return $("span.input-responsive-width").width();
  };

  var Exam = {
    currentStep: 0,
    currentStepIndex: 0,

    gender: 1,

    examSteps: [
      {
        number: 1,
        title: 'owl'
      },{
        number: 2,
        title: 'barkov'
      },{
        number: 3,
        title: 'moles'
      },{
        number: 4,
        title: 'goosification'
      },{
        number: 5,
        title: 'navels'
      },{
        number: 6,
        title: 'furcoats'
      },{
        number: 7,
        title: 'burial'
      },{
        number: 8,
        title: 'renunciation'
      },{
        number: 9,
        title: 'goodbye'
      },{
        number: 10,
        title: 'finish'
      }
    ],

    successMessages: {
      1: {
        title: 'Браво!',
        text: 'Как и вы, благородную «сову правды», «сотрудницу славы», при повторном вступлении в «Арзамас» облобызал Василий Львович Пушкин'
      },
      2: {
        title: 'Поздравляем!',
        text: 'Вы написали «Тень Баркова» — настолько непристойную вещь юного Пушкина, что ее никогда не печатают в его собраниях сочинений.'
      },
      3: {
        title: 'Браво!',
        text: 'Красный якобинский колпак означал для «Арзамаса» европейские ценности: свободу, равенство, братство — вот это все'
      },
      4: {
        title: 'Поздравляем!',
        text: 'Арзамасцы настолько сильно любили свой символ — гуся, что иногда вставляли его в знаменитые стихотворения, например: «Где гусь? — Он там! — Где там? — Не знаю!» (почти Державин)'
      },
      5: {
        title: 'Поздравляем!',
        text: '«Глупцы живут на земле для наших маленьких удовольствий» — девиз «Арзамаса»; под глупцами подразумевались, конечно, члены «Беседы». Александр Тургенев однажды заснул на заседании «Арзамаса» и потому произнес речь пупком.'
      },
      6: {
        title: 'Поздравляем!',
        text: 'Арзамасцы смеялись над шубами из-за поэмы беседчика Шаховского «Расхищенные шубы». Во время приема в «Арзамас» под грудой шуб лежал Василий Львович Пушкин.'
      },
      7: {
        title: 'Поздравляем!',
        text: 'Арзамасцы считали своих врагов-беседчиков мертвецами, произносили в их честь шутовские надгробные речи и&nbsp;хоронили их стихи.'
      }
    },

    successSound: new Howl({
      urls: ['sounds/step-success.mp3']
    }),

    start: function(){
      $('.exam__container').removeClass('exam__container-intro');
      $('.exam__container .exam__intro').hide();

      Exam.currentStep = Exam.examSteps[Exam.currentStepIndex].number;
      Exam.showCurrentStep();
    },

    markCurrentStep: function(){
      var currentIndicatorIndex = Exam.currentStepIndex;
      if(Exam.currentStepIndex >= 9){
        currentIndicatorIndex = 8;
      }

      $('.exam__container .exam__list .exam__steps-indication .indication__item').removeClass('indication__item-active');
      $('.exam__container .exam__list .exam__steps-indication .indication__item').eq(currentIndicatorIndex).addClass('indication__item-active');
      $('.exam__container .exam__list .exam__steps-indication .indication__item').eq(currentIndicatorIndex).prevAll('.indication__item').text('').addClass('indication__item-complete');
    },

    showCurrentStep: function(){
      Exam.markCurrentStep();

      $('.exam__container .exam__list, .exam__container .exam__list .exam__item').hide();
      $('.exam__container .exam__list, .exam__container .exam__list .exam__item-'+ Exam.currentStep).show();

      $('.exam__container').removeClass('exam__container-intro');

      Exam[Exam.examSteps[Exam.currentStepIndex].title].start();
    },

    showSuccess: function(){
      if(Exam.currentStepIndex < 7) {
        Exam.successSound.play();
        $('.exam__container .exam__list .task__success .title').html(Exam.successMessages[Exam.currentStep].title);
        $('.exam__container .exam__list .task__success .text').html(Exam.successMessages[Exam.currentStep].text);

        $('.exam__container .exam__list .task__success').show();
      }else{
        Exam.showNextStep();
      }

      $('.exam__container .exam__list .task__success .button').off().on('click', function(){
        Exam.showNextStep();
      });
    },

    showNextStep: function(){
      Exam.currentStepIndex++;

      if(Exam.currentStepIndex < Exam.examSteps.length) {
        Exam.currentStep = Exam.examSteps[Exam.currentStepIndex].number;

        $('.exam__container .exam__list .task__success').hide();
      }else{
        Exam.currentStepIndex = 7;
      }
      Exam.showCurrentStep();
    },

    owl: {
      answers: [
        'Может, все-таки поцелуешь?',
        'Ты чего такой скромный?',
        'Целуй, я царевна-сова!',
        'Хочешь в «Арзамас» — тогда целуй!'
      ],
      start: function(){

        Exam.owl.startTimer();

        $('.button__yes', '.exam__item-1 .item__buttons').click(function(){
          Exam.showSuccess();
        });

        $('.button__no', '.exam__item-1 .item__buttons').click(function(){
          Exam.owl.startTimer();
          var answerNumber = getRandomInt(0, Exam.owl.answers.length);
          $('.item__hint', '.exam__item-1').html(Exam.owl.answers[answerNumber]).show();
        });
      },
      startTimer: function(){
        $('.kiss__timer', '.exam__item-1').show();
        $('.item__buttons', '.exam__item-1').hide();

        var kissTime = 5;
        $('.kiss__timer', '.exam__item-1').text(kissTime);
        var kissTimer = setInterval(function(){
          if(kissTime > 0){
            kissTime--;
            $('.kiss__timer', '.exam__item-1').text(kissTime);
          }else{
            clearInterval(kissTimer);
            $('.kiss__timer', '.exam__item-1').hide();
            $('.item__buttons', '.exam__item-1').show();
          }
        }, 1000);
      }
    },

    barkov: {
      fillCount: 0,
      selectedPoemIndex: 0,

      getPoem: function(){
        var poemIndex = getRandomInt(1, 5),
          poemTemplate = $('#poem-'+ poemIndex).html();

        if(poemIndex == Exam.barkov.selectedPoemIndex){
          Exam.barkov.getPoem();
          return false;
        }

        Exam.barkov.selectedPoemIndex = poemIndex;

        $('.poem__text', '.exam__item-2 .barkov__block').html(poemTemplate);

        $('.poem__fragment', '.exam__item-2 .barkov__block').on('keyup', function(e){
          e.preventDefault();
          if(Exam.barkov.checkFragmentsFill()){
            $('.words__left', '.exam__item-2 .barkov__block').hide();
            $('.item__buttons', '.exam__item-2 .barkov__block').show();
          }else{
            Exam.barkov.setFillCountLeftCaption();
          }
        });

        $('.poem__fragment', '.exam__item-2 .barkov__block').on('keyup keypress focus blur change', function(){
          var input_width = $(this).textWidth() + 5;
          $(this).css({
            width: input_width + 'px'
          });
        });
      },
      start: function(){
        Exam.barkov.getPoem();

        Exam.barkov.checkFragmentsFill();
        Exam.barkov.setFillCountLeftCaption();

        $('.button__yes, .button__wait', '.exam__item-2 .item__buttons').click(function(){
          Exam.showSuccess();
        });

        $('.button__no', '.exam__item-2 .item__buttons').click(function(){
          Exam.barkov.getPoem();
          $('.poem__fragment', '.exam__item-2 .barkov__block').val('').trigger('blur');
          Exam.barkov.checkFragmentsFill();

          $('.words__left', '.exam__item-2 .barkov__block').show();
          $('.item__buttons', '.exam__item-2 .barkov__block').hide();

          Exam.barkov.setFillCountLeftCaption();
        });
      },
      checkFragmentsFill: function(){
        var filledAll = true;
        Exam.barkov.fillCount = 0;
        $('.poem__fragment', '.exam__item-2 .barkov__block').each(function(){
          if($(this).val() == ''){
            Exam.barkov.fillCount++;
            filledAll = false;
          }
        });
        return filledAll;
      },
      setFillCountLeftCaption: function(){
        $('.words__left span', '.exam__item-2 .barkov__block').html(Exam.barkov.fillCount +' '+ declOfNum(Exam.barkov.fillCount, ['слово', 'слова', 'слов']));
      }
    },

    moles: {
      molesList: [1, 2, 3, 4, 5, 6, 7, 8, 9],

      trueMoles: [2, 3, 4],
      selectedMoles: [],
      activeMoleIndex: null,

      molesInterval: null,
      molesIntervalStep: 0,
      molesIntervalPaused: false,

      popSound: null,
      failSound: null,
      successSound: null,

      start: function(){
        Exam.moles.prepareSounds();
        Exam.moles.startMolesInterval();

        $('.mole__item .mole__head', '.exam__item-3 .moles__block .moles__table').click(Exam.moles.moleHeadClick);
      },

      moleHeadClick: function(){
        Exam.moles.molesIntervalPaused = true;

        var moleIndex = $(this).data('moleIndex'),
          moleItem = $('.mole__item .mole__head-'+ moleIndex, '.exam__item-3 .moles__block');

        if(Exam.moles.trueMoles.indexOf(moleIndex) == -1){
          Exam.moles.failSound.play();
          Exam.moles.molesIntervalPaused = false;
          Exam.moles.showFail();
          return false;
        }

        if(!moleItem.hasClass('mole__item-selected')) {
          Exam.moles.successSound.play();
          moleItem.addClass('mole__item-selected');
          Exam.moles.selectedMoles.push(moleIndex);
        }

        if(Exam.moles.checkSelectedMoles()){
          clearTimeout(Exam.moles.molesTimeoutUp);
          clearTimeout(Exam.moles.molesTimeoutDown);
          setTimeout(function() {
            Exam.showSuccess();
          }, 2000);
        }
        Exam.moles.molesIntervalPaused = false;
      },

      prepareSounds: function(){
        Exam.moles.popSound = new Howl({
          urls: ['sounds/whack-pop.mp3']
        });

        Exam.moles.failSound = new Howl({
          urls: ['sounds/whack-fail.mp3']
        });

        Exam.moles.successSound = new Howl({
          urls: ['sounds/whack-success.mp3']
        });
      },

      getMoleIndex: function(){
        var moleIndex = getRandomInt(0, 9);
        if(moleIndex == Exam.moles.activeMoleIndex){
          Exam.moles.getMoleIndex();
          return false;
        }
        Exam.moles.activeMoleIndex = moleIndex;
      },

      startMolesInterval: function(){
        Exam.moles.molesTimeoutUp = setTimeout(function(){
          if(!Exam.moles.molesIntervalPaused) {
            Exam.moles.shuffleMoles();

            Exam.moles.getRandomMole();

            if (!Exam.moles.moleItemHead.hasClass('mole__item-selected')) {
              $('.mole__item', '.exam__item-3 .moles__block .moles__table').removeClass('mole__item-active');
              Exam.moles.popSound.play();
              Exam.moles.moleItem.addClass('mole__item-active');
            }

            if (Exam.moles.molesIntervalStep > 0 && Exam.moles.molesIntervalStep % 7 == 0) {
              var moleIndexAdditional = getRandomInt(0, 9),
                moleItemAdditional = $('.mole__item', '.exam__item-3 .moles__block .moles__table').eq(moleIndexAdditional),
                moleItemHeadAdditional = $('.mole__head', moleItemAdditional);

              if (!moleItemHeadAdditional.hasClass('mole__item-selected')) {
                moleItemAdditional.addClass('mole__item-active');
              }
            }

            Exam.moles.molesTimeoutDown = setTimeout(function(){
              $('.mole__item', '.exam__item-3 .moles__block .moles__table').removeClass('mole__item-active');
              clearTimeout(Exam.moles.molesTimeoutUp);

              Exam.moles.molesIntervalStep++;

              Exam.moles.startMolesInterval();
            }, 1000);
          }
        }, 500);
      },

      getRandomMole: function(){

        Exam.moles.getMoleIndex();

        var moleItem = $('.mole__item', '.exam__item-3 .moles__block .moles__table').eq(Exam.moles.activeMoleIndex),
            moleItemHead = $('.mole__head', moleItem);

        if(moleItemHead.hasClass('mole__item-selected')){
          Exam.moles.getRandomMole();
          return false;
        }

        Exam.moles.moleItem = moleItem;
        Exam.moles.moleItemHead = moleItemHead;
      },

      shuffleMoles : function() {
        var allElements = $('.moles__table .mole__item .mole__head').get(),
            shuffledElements = shuffleArray(allElements);

        $('.moles__table .mole__item').each(function(i){
            $(this).html(shuffledElements[i]);
            $('.mole__head', this).bind('click', Exam.moles.moleHeadClick);
        });
      },

      checkSelectedMoles: function(){
        var selectedMolesCount = 0;
        $('.mole__item .mole__head', '.exam__item-3 .moles__block .moles__score').each(function(){
          if($(this).hasClass('mole__item-selected')){
            selectedMolesCount++;
          }
        });
        return selectedMolesCount == 3;
      },

      showFail: function(){
        $('.task__fail', '.exam__item-3').show();
        $('.mole__item', '.exam__item-3 .moles__block').removeClass('mole__item-active');
        $('.mole__item .mole__head', '.exam__item-3 .moles__block').removeClass('mole__item-selected');
        clearInterval(Exam.moles.molesTimeoutUp);
        clearInterval(Exam.moles.molesTimeoutDown);

        $('.button', '.exam__item-3 .task__fail').off().on('click', function(){
          $('.task__fail', '.exam__item-3').hide();
          Exam.moles.startMolesInterval();
        });
      }
    },

    goosification: {
      selectedPoem: null,
      selectedPoemIndex: 0,

      fillCount: 0,
      fillLimit: 5,

      poems: {
        1: [
          [
            {
              normal: 'Люблю',
              goose: 'Гусю'
            },
            {
              normal: 'грозу',
              goose: 'гуся'
            },
            {
              normal: 'в начале',
              goose: 'в гусином'
            },
            {
              normal: 'мая',
              goose: 'гуся'
            }
          ],
          [
            {
              normal: 'Когда',
              goose: 'Гуся'
            },
            {
              normal: 'весенний',
              goose: 'гусиный'
            },
            {
              normal: 'первый',
              goose: 'га-га'
            },
            {
              normal: 'гром',
              goose: 'гусь'
            }
          ],
          [
            {
              normal: 'Как бы',
              goose: 'Га-га'
            },
            {
              normal: 'резвяся',
              goose: 'гусяся'
            },
            {
              normal: 'и играя',
              goose: 'и щипая'
            }
          ],
          [
            {
              normal: 'Грохочет',
              goose: 'Гогочет'
            },
            {
              normal: 'в небе',
              goose: 'в пруде'
            },
            {
              normal: 'голубом',
              goose: 'гусаком'
            }
          ]
        ],
        2: [
          [
            {
              normal: 'Я помню',
              goose: 'Гусинье'
            },
            {
              normal: 'чудное мгновенье',
              goose: 'мокро оперенье'
            }
          ],
          [
            {
              normal: 'Передо мной',
              goose: 'Перед гусем'
            },
            {
              normal: 'явилась',
              goose: 'гусилась'
            },
            {
              normal: 'ты',
              goose: 'га'
            }
          ],
          [
            {
              normal: 'Как мимолетное виденье',
              goose: 'В пруду гусиное творенье'
            }
          ],
          [
            {
              normal: 'Как гений',
              goose: 'Гусыня'
            },
            {
              normal: 'чистой',
              goose: 'мокрой'
            },
            {
              normal: 'красоты',
              goose: 'гусоты'
            }
          ]
        ],
        3: [
          [
            {
              normal: 'Буря',
              goose: 'Утка'
            },
            {
              normal: 'мглою',
              goose: 'клювом'
            },
            {
              normal: 'небо',
              goose: 'гуся'
            },
            {
              normal: 'кроет',
              goose: 'точит'
            }
          ],
          [
            {
              normal: 'Вихри',
              goose: 'Гуси'
            },
            {
              normal: 'снежные',
              goose: 'мокрые'
            },
            {
              normal: 'крутя',
              goose: 'гогочут'
            }
          ],
          [
            {
              normal: 'То, как зверь,',
              goose: 'То, как гусь,'
            },
            {
              normal: 'она',
              goose: 'гага'
            },
            {
              normal: 'завоет',
              goose: 'гогочет'
            }
          ],
          [
            {
              normal: 'То заплачет,',
              goose: 'То гуснется,'
            },
            {
              normal: 'как дитя',
              goose: 'как утя'
            }
          ]
        ],
        4: [
          [
            {
              normal: 'Ночь',
              goose: 'Гусь'
            },
            {
              normal: 'улица',
              goose: 'уточка'
            },
            {
              normal: 'фонарь',
              goose: 'гусак'
            },
            {
              normal: 'аптека',
              goose: 'гусыня'
            }
          ],
          [
            {
              normal: 'Бессмысленный',
              goose: 'Гусеющий'
            },
            {
              normal: 'и тусклый',
              goose: 'гусиный'
            },
            {
              normal: 'свет',
              goose: 'гусь'
            }
          ],
          [
            {
              normal: 'Живи',
              goose: 'Гоняй'
            },
            {
              normal: 'еще',
              goose: 'гусей'
            },
            {
              normal: 'хоть четверть',
              goose: 'хоть клювик'
            },
            {
              normal: 'века',
              goose: 'гуся'
            }
          ],
          [
            {
              normal: 'Все будет',
              goose: 'Гусь будет'
            },
            {
              normal: 'так.',
              goose: 'гусь.'
            },
            {
              normal: 'Исхода',
              goose: 'Гусыня —'
            },
            {
              normal: 'нет.',
              goose: 'гусь.'
            }
          ]
        ],
        5: [
          [
            {
              normal: 'Умом',
              goose: 'Гусем'
            },
            {
              normal: 'Россию',
              goose: 'гусыню'
            },
            {
              normal: 'не понять',
              goose: 'не гонять'
            }
          ],
          [
            {
              normal: 'Аршином общим',
              goose: 'Гусиным метром'
            },
            {
              normal: 'не измерить',
              goose: 'не закрякать'
            }
          ],
          [
            {
              normal: 'У ней',
              goose: 'У ней'
            },
            {
              normal: 'особенная',
              goose: 'янгусовская'
            },
            {
              normal: 'стать',
              goose: 'кряк'
            }
          ],
          [
            {
              normal: 'В Россию',
              goose: 'В гусыню'
            },
            {
              normal: 'можно',
              goose: 'можно'
            },
            {
              normal: 'только',
              goose: 'только'
            },
            {
              normal: 'верить',
              goose: 'крякать'
            }
          ]
        ],
        6: [
          [
            {
              normal: 'Не позволяй',
              goose: 'Не гусьволяй'
            },
            {
              normal: 'душе',
              goose: 'гусю'
            },
            {
              normal: 'лениться!',
              goose: 'гуситься!'
            }
          ],
          [
            {
              normal: 'Чтоб в ступе воду',
              goose: 'В гусином супе'
            },
            {
              normal: 'не толочь',
              goose: 'не макай'
            }
          ],
          [
            {
              normal: 'Душа обязана',
              goose: 'Утя обязана'
            },
            {
              normal: 'трудиться',
              goose: 'гуситься'
            }
          ],
          [
            {
              normal: 'И день',
              goose: 'И гусь'
            },
            {
              normal: 'и ночь,',
              goose: 'и фарш,'
            },
            {
              normal: 'и день',
              goose: 'и гусь'
            },
            {
              normal: 'и ночь!',
              goose: 'и фарш!'
            }
          ]
        ],
        7: [
          [
            {
              normal: 'Тучки',
              goose: 'Гуси'
            },
            {
              normal: 'небесные',
              goose: 'гусиные'
            },
            {
              normal: 'вечные',
              goose: 'мокрые'
            },
            {
              normal: 'странники',
              goose: 'гусики'
            }
          ],
          [
            {
              normal: 'Степью',
              goose: 'Лапкой'
            },
            {
              normal: 'лазурною',
              goose: 'утиною'
            },
            {
              normal: 'цепью',
              goose: 'лапкой'
            },
            {
              normal: 'жемчужною',
              goose: 'гусиною'
            }
          ],
          [
            {
              normal: 'Мчитесь вы будто',
              goose: 'Мчитесь вы, гуси,'
            },
            {
              normal: 'как я же',
              goose: 'гуськом'
            },
            {
              normal: 'изгнанники',
              goose: 'гуси-лебеди'
            }
          ],
          [
            {
              normal: 'С милого',
              goose: 'С гусьего'
            },
            {
              normal: 'севера',
              goose: 'прудика'
            },
            {
              normal: 'в сторону южную',
              goose: 'в сторону лужную'
            }
          ]
        ]
      },

      getPoem: function(){
        var poemIndex = getRandomInt(1, 8);

        if(poemIndex == Exam.goosification.selectedPoemIndex){
          Exam.goosification.getPoem();
          return false;
        }

        Exam.goosification.selectedPoemIndex = poemIndex;

        Exam.goosification.selectedPoem = Exam.goosification.poems[poemIndex];
        Exam.goosification.preparePoem();
      },

      preparePoem: function(){
        var poemItem = Exam.goosification.selectedPoem;

        if(poemItem.length){
          $('.goosification__block .goosification__container').html('');
          poemItem.forEach(function(poemRow){
            if(poemRow.length){
              var $poemRow = $('<div class="poem__row"></div>');
              poemRow.forEach(function(poemItem){
                var $poemItem = $('<div class="poem__item"></div>'),
                  $itemNormal = $('<div class="item__normal">'+ poemItem.normal +'</div>'),
                  $itemGoose = $('<div class="item__goose">'+ poemItem.goose +'</div>');

                $poemItem.append($itemNormal, $itemGoose).bind('click', function(){
                  if(Exam.goosification.fillLimit > 0){
                    $(this).toggleClass('poem__item-selected');
                  }else{
                    $(this).removeClass('poem__item-selected');
                  }

                  Exam.goosification.checkFragmentsFill();
                });

                $poemRow.append($poemItem);
              });
              $('.goosification__block .goosification__container').append($poemRow);
            }
          });
        }
      },

      refreshPoemResults: function(){
        Exam.goosification.fillCount = 0;
        Exam.goosification.fillLimit = 5;
        $('.poem__item', '.exam__item-4 .goosification__block').removeClass('poem__item-selected');
        Exam.goosification.checkFragmentsFill();
      },

      start: function(){
        Exam.goosification.getPoem();

        $('.button__yes', '.exam__item-4 .item__buttons').click(function(){
          Exam.showSuccess();
        });

        $('.button__repeat', '.exam__item-4 .item__buttons').click(function(){
          Exam.goosification.refreshPoemResults();
        });

        $('.button__another', '.exam__item-4 .item__buttons').click(function(){
          Exam.goosification.getPoem();
          Exam.goosification.refreshPoemResults();
        });
      },

      checkFragmentsFill: function(){
        Exam.goosification.fillCount = 0;
        $('.poem__item', '.exam__item-4 .goosification__block').each(function(){
          if($(this).hasClass('poem__item-selected')){
            Exam.goosification.fillCount++;
            Exam.goosification.fillLimit = 5 - Exam.goosification.fillCount;
          }
        });
        Exam.goosification.setFillCountLeftCaption();

        if(Exam.goosification.fillLimit <= 0){
          $('.goosification__block__hint', '.exam__item-4').hide();
          $('.goosification__result', '.exam__item-4').show();
        }else{
          $('.goosification__block__hint', '.exam__item-4').show();
          $('.goosification__result', '.exam__item-4').hide();
        }
      },

      setFillCountLeftCaption: function(){
        var captionCount = 5 - Exam.goosification.fillCount;
        $('.goosification__block__hint span', '.exam__item-4').html(captionCount +' '+ declOfNum(captionCount, ['слово', 'слова', 'слов']));
      }
    },

    navels: {
      phrase: [
        'Глупцы',
        'живут',
        'на земле',
        'для наших',
        'маленьких',
        'удовольствий.'
      ],

      resultPhrase: [],
      navelList: [1,2,3,4,5,6],

      sounds: {},
      prepareSounds: function(){
        Exam.navels.navelList.forEach(function(navelItem){
          Exam.navels.sounds[navelItem] = new Howl({
            urls: ['sounds/navels/navel-'+ navelItem +'.wav']
          });
        });
      },

      start: function(){

        Exam.navels.prepareSounds();

        var navelList = shuffleArray(Exam.navels.navelList);

        $('.navel__list', '.exam__item-5 .navel__block').html('');

        navelList.forEach(function(navelItem, index){
          var $navelItem = $('<div class="navel__item"></div>'),
              $navelHint = $('<div class="item__hint">'+ Exam.navels.phrase[navelItem - 1] +'</div>');

          $navelItem.addClass('navel__item-'+ navelItem)
            .data({
              phraseItem : Exam.navels.phrase[navelItem - 1],
              phraseItemIndex : navelItem
            });

          if(index == 2 || index == 5){
            $navelItem.addClass('navel__item-last-row');
          }
          $navelItem.append($navelHint);

          $('.navel__list', '.exam__item-5 .navel__block').append($navelItem);
        });

        $('.navel__item', '.exam__item-5 .navel__block').click(function(){
          var navelItem = $(this),
              phraseItem = navelItem.data('phraseItem'),
              phraseItemIndex = navelItem.data('phraseItemIndex');

          Exam.navels.sounds[phraseItemIndex].play();

          Exam.navels.resultPhrase.push(phraseItem);

          navelItem.addClass('navel__item-active');
          $('.item__hint', navelItem).show();

          if(Exam.navels.checkSelectedPhrase()){
            setTimeout(function() {
              Exam.showSuccess();
            }, 1000);
          }

          var navelIntervalCount = 0,
            navelInterval = setInterval(function(){
              if(navelIntervalCount == 2){
                clearInterval(navelInterval);
              }

              navelItem.toggleClass('navel__item-active');
              navelIntervalCount++;
            }, 110);

          setTimeout(function(){
            $('.item__hint', navelItem).hide();
          }, 1000);
        });

      },
      checkSelectedPhrase: function(){
        if(Exam.navels.resultPhrase.length >= 6){
          var sliceStartPosition = Exam.navels.resultPhrase.length - 6,
            sliceEndPosition = sliceStartPosition + 6,
            endPhrase = Exam.navels.resultPhrase.slice(sliceStartPosition, sliceEndPosition);

          return  arraysEqual(endPhrase, Exam.navels.phrase);
        }
      }
    },

    furcoats: {
      bunches: ['raccoon', 'coat', 'alexander'],
      guyBunchIndex: null,

      start: function(){
        Exam.furcoats.prepareBunches();
      },

      prepareBunches: function(){
        var resultBunches = shuffleArray(Exam.furcoats.bunches);
        Exam.furcoats.guyBunchIndex = resultBunches.indexOf('coat');

        resultBunches.forEach(function(bunchItem, index){
          $('.bunch__item', '.exam__item-6 .furcoats__block').eq(index).addClass('bunch__item-'+ bunchItem);
          Exam.furcoats.prepareBunchElements(index);
        });

        $('.bunch__item', '.exam__item-6 .furcoats__block').removeClass('bunch__item-guy');
        $('.bunch__item .guy__head', '.exam__item-6 .furcoats__block').remove();

        $('.bunch__item', '.exam__item-6 .furcoats__block').eq(Exam.furcoats.guyBunchIndex).addClass('bunch__item-guy');

        var $guyHead = $('<div class="guy__head"></div>');
        $guyHead.click(function(){
          Exam.showSuccess();
        });

        $('.bunch__item', '.exam__item-6 .furcoats__block').append($guyHead);
      },

      prepareBunchElements: function(bunchIndex){
        for(var i = 1; i <= 9; i++){
          var $bunchElement = $('<div class="bunch__element"></div>');
          $bunchElement.addClass('bunch__element-'+ i);

          var rotateDegree = getRandomInt(0, 361) * getRandomInt(0, 9) - 165;

          $bunchElement.css({
            '-webkit-transform' : 'rotate('+ rotateDegree +'deg)',
            '-moz-transform' : 'rotate('+ rotateDegree +'deg)',
            '-ms-transform' : 'rotate('+ rotateDegree +'deg)',
            'transform' : 'rotate('+ rotateDegree +'deg)'
          });

          $('.bunch__item', '.exam__item-6 .furcoats__block').eq(bunchIndex).append($bunchElement);
        }

        $('.bunch__element', '.exam__item-6 .furcoats__block').draggable({
          stop: function(event, element){
            var bunchElementIndex = $(element.helper).index(),
              bunchContainer = $(element.helper).closest('.bunch__item');
          }
        });
      }
    },

    burial: {
      poemsList: [],

      truePoemIndex: null,
      falsePoemIndex: [],

      start: function(){

        Exam.burial.getPoems();

        $('.grave__hole', '.exam__item-7 .burial__block').droppable({
          drop: function (e, el) {
            if(!$(el.helper).data('poemVerify')){
              el.draggable.draggable('option', 'revert', true);

              setTimeout(function(){
                Exam.burial.getPoems();
              }, 1000);

              Exam.burial.showErrorHint();
            }else{
              $(el.helper).hide();
              $('.grave__hole', '.exam__item-7 .burial__block').hide();
              $('.grave__bunch', '.exam__item-7 .burial__block').show();
              $('.monument', '.exam__item-7 .burial__block').addClass('monument-rip');

              setTimeout(function() {
                Exam.showSuccess();
              }, 2000);
            }
          }
        });

      },

      getPoems: function(){
        Exam.burial.poemsList = [];

        Exam.burial.getPoemTrue();
        Exam.burial.getPoemFalse1();
        Exam.burial.getPoemFalse2();

        Exam.burial.preparePoems();

        $('.poem__item', '.exam__item-7 .burial__block').draggable({
          revert: 'invalid'
        });
      },

      getPoemTrue: function(){

        var trueIndex = getRandomInt(0, $('.poem__item', '.poems__group-true').length);

        if(trueIndex == Exam.burial.truePoemIndex){
          Exam.burial.getPoemTrue();
          return false;
        }

        Exam.burial.truePoemIndex = trueIndex;

        var trueElement = $('.poem__item', '.poems__group-true').eq(Exam.burial.truePoemIndex);

        Exam.burial.poemsList.push({element: trueElement, type: true});
      },

      getPoemFalse1: function(){

        var falseIndex = getRandomInt(0, $('.poem__item', '.poems__group-false').length);

        if(falseIndex == Exam.burial.falsePoemIndex1 && falseIndex != Exam.burial.falsePoemIndex2){
          Exam.burial.getPoemFalse1();
          return false;
        }

        Exam.burial.falsePoemIndex1 = falseIndex;

        var falseElement = $('.poem__item', '.poems__group-false').eq(Exam.burial.falsePoemIndex1);

        Exam.burial.poemsList.push({element: falseElement, type: false});
      },

      getPoemFalse2: function(){

        var falseIndex = getRandomInt(0, $('.poem__item', '.poems__group-false').length);

        if(falseIndex == Exam.burial.falsePoemIndex1 && falseIndex != Exam.burial.falsePoemIndex2){
          Exam.burial.getPoemFalse2();
          return false;
        }

        Exam.burial.falsePoemIndex2 = falseIndex;

        var falseElement = $('.poem__item', '.poems__group-false').eq(Exam.burial.falsePoemIndex2);

        Exam.burial.poemsList.push({element: falseElement, type: false});
      },

      preparePoems: function(){
        Exam.burial.poemsList = shuffleArray(Exam.burial.poemsList);

        Exam.burial.poemsList.forEach(function(poemItem, index){
          var poemIndex = index + 1;
          $('.poem__item-'+ poemIndex).data('poemVerify', poemItem.type).html(poemItem.element.html());
        })
      },

      showErrorHint: function(){
        $('.hint__error', '.exam__item-7 .burial__block').show();
        setTimeout(function(){
          $('.hint__error', '.exam__item-7 .burial__block').hide();
        }, 2000);
      }
    },

    renunciation: {
      start: function(){
        $('.list__item', '.exam__item-8 .renunciation__block .renunciation__list').click(function(){
          $(this).toggleClass('list__item-checked');
          if($('.list__item-checked', '.exam__item-8 .renunciation__block .renunciation__list').length > 0){
            $('.item__buttons', '.exam__item-8 .renunciation__block').show();
          }else{
            $('.item__buttons', '.exam__item-8 .renunciation__block').hide();
          }
        });

        $('.button__yes', '.exam__item-8 .renunciation__block .item__buttons').click(function(){
          var checkedCount = 0;
          $('.list__item', '.exam__item-8 .renunciation__block .renunciation__list').each(function(){
            if($(this).hasClass('list__item-checked')){
              checkedCount++;
            }
          });

          if(checkedCount == $('.list__item', '.exam__item-8 .renunciation__block .renunciation__list').length){
            Exam.showSuccess();
          }else{
            $('.item__hint', '.exam__item-8 .renunciation__block .item__buttons').show();
            setTimeout(function(){
              $('.item__hint', '.exam__item-8 .renunciation__block .item__buttons').hide();
            }, 2000);
          }
        });
      }
    },

    goodbye: {
      start: function(){
        $('.goodbye__name', '.exam__item-9 .goodbye__block .goodbye__form').on('keyup keypress focus blur', function(){
          if($(this).val() != ''){
            $('.button', '.exam__item-9 .goodbye__block .goodbye__form').removeClass('disabled');
          }else{
            $('.button', '.exam__item-9 .goodbye__block .goodbye__form').addClass('disabled');
          }
        });

        $('.button', '.exam__item-9 .goodbye__block .goodbye__form').click(function(){
          if(!$(this).hasClass('disabled')){
            $('.goodbye__question', '.exam__item-9 .goodbye__block').show();
            $('.gender__choice', '.exam__item-9 .goodbye__block').show();
            $('.item__buttons', '.exam__item-9 .goodbye__block').show();
            $(this).hide();
          }
        });

        $('.gender__item', '.exam__item-9 .gender__variants').click(function(){
          $('.gender__item', '.exam__item-9 .gender__variants').removeClass('gender__item-selected');
          $(this).addClass('gender__item-selected');

          Exam.gender = $(this).data('gender');
        });

        $('.button__yes', '.exam__item-9 .goodbye__block .item__buttons').click(function(){
          Exam.showSuccess();
        });
        $('.button__no', '.exam__item-9 .goodbye__block .item__buttons').click(function(){
          $('.item__hint', '.exam__item-9 .goodbye__block .item__buttons').show();
          setTimeout(function(){
            $('.item__hint', '.exam__item-9 .goodbye__block .item__buttons').hide();
          }, 2000);
        });
      }
    },

    finish: {
      start: function(){
        $('.exam__container .exam__list .exam__steps-indication').hide();

        Exam.share.init();

        $('.card__block img').attr('src', Exam.share.cardsDomainPath + Exam.share.cardsDirectory + Exam.share.finalCard + '.png');

        $('.new__name', '.exam__item-10 .finish__block').html(Exam.nickname);
      },
      nicknames: [
        'Эльвина',
        'Эдвин',
        'Мальвина',
        'Ивик',
        'Рыцарь Тогенбург',
        'Доника',
        'Алина',
        'Альсим',
        'Гаральд',
        'Смальгольмский Барон',
        'Гаттон',
        'Урака',
        'Роллон',
        'Ленора',
        'Алонзо',
        'Изолина',
        'Карл (Великий)',
        'Уллин',
        'Церера',
        'Прозерпина',
        'Аббадона',
        'Овсяный Кисель',
        'Красный Карбункул',
        'Бука',
        'Минвана',
        'Арминий',
        'Мирамолин',
        'Ринальдо',
        'Бландина',
        'Бедная Эми',
        'Каннитферштан',
        'Царь Берендей',
        'Пышка',
        'Белая Шубка',
        'Квакун Двадесятый',
        'Долгохвост Иринарий',
        'Прасковья-Пискунья',
        'Бешеный Хвост',
        'Царь Матвей',
        'Кот в Сапогах',
        'Петр-Царевич',
        'Славянка',
        'Лалла Рук',
        'Пловец',
        'Певец',
        'Узник',
        'Злодей',
        'Дума',
        'Кузнец',
        'Младенец',
        'Башмачок',
        'Пери',
        'Чернец',
        'Пилигрим',
        'Рыбак',
        'Лесной Царь',
        'Рудольф',
        'Дедушка',
        'Ундина',
        'Магистр',
        'Чужеземная Краса',
        'Трубный Треск',
        'Величавый Месяц',
        'Борзый Конь',
        'Водный Ток',
        'Шесть Досок',
        'Листья Повилики',
        'Звезды Утренни',
        'Погребальный Факел',
        'Стигийская Тень',
        'Духи Бледною Толпою',
        'Смертная Скудель',
        'Надгробный Вой',
        'Карающий Громами',
        'Приправа Добрых Слов',
        'Блестящий Огонек',
        'Цвет Душистый Фиалки Полевой',
        'Скат Лесистых Берегов',
        'Легкокрылый Ветерок',
        'Дивный Плаватель',
        'Мгла Сырая Над Рекой',
        'Алый Парус',
        'Ярый Воск',
        'Ангел-утешитель',
        'Вестник Полуночи',
        'Вещее Сердце',
        'Туманный Круг',
        'Бледен и Унылый',
        'Хижинка Под Снегом',
        'Белоснежный Голубок',
        'Ах!',
        'Чада Гелы',
        'Бой Певцов',
        'Лирные Струны',
        'Коринфский Друг',
        'Гнусная Рука',
        'Пришелец из Могилы',
        'Мука на Муке',
        'Пустынная Сова',
        'Дрожащий Стон Рогов',
        'Кровожадный Червь',
        'Неведомый Мильтон',
        'Кромвель Неукротимый',
        'Низложенный Кедр',
        'Напыщенный Мечтатель',
        'Усталый Селянин',
        'Вечерний Жук',
        'Туз Бубновый',
        'Минута Небес',
        'Хоровод Бесплотных',
        'Союз Сердец',
        'Тоска-Печаль',
        'Златой Бокал',
        'Пламень Гаснущих Костров',
        'Бедный Царь',
        'Сирая Душа',
        'Троянец с Бледным Ликом',
        'Владыко Морвены',
        'Кудрявый Кустарник',
        'Томное Сердце',
        'Власы Горой',
        'Эфирные Персты',
        'Адский Блеск',
        'Вестник Искупленья',
        'Чудесный Муж',
        'Серебряный Звонок',
        'Огромный Великан',
        'Вепря Тяжкий Топот',
        'Бледный Пламень',
        'Птица Ночи',
        'Пепел Инокинь',
        'Семь Избирателей',
        'Пленитель Сердец',
        'Обнаженная Стопа',
        'Боец Седой',
        'Двадцатифунтовой Топор',
        'Паж Молодой',
        'Тяжелая Шуйца',
        'Мрачный Монах',
        'Острогрудый Корабль',
        'Поликратов Перстень',
        'Неизбежный Зверь',
        'Противный Свет',
        'Воздушных Рой',
        'Безглазый Череп',
        'Скромный Вассал',
        'Нехристь',
        'Свирепый Мавр',
        'Огромная Рукавица',
        'Покинутая Цепь',
        'Над Болотом Огонек',
        'Гонитель Вепрей и Волков',
        'Лазоревое Крыло',
        'Паук Темничный',
        'Мальчик-кудряшка',
        'И все тут',
        'Кус Ветчины',
        'Усатое Рыльце',
        'Добрый Рак',
        'Старинушка Честной',
        'Зародышек',
        'Пухлая Репа',
        'Князь Тупоносый',
        'Рядовой Поэт'
      ]
    },

    share: {
      cardsDomainPath: 'http://cdn-s-static.arzamas.academy/results/890/',
      cardsDirectory: '',
      finalCard: '',
      init: function(){
        Exam.nickname = Exam.finish.nicknames[getRandomInt(0, Exam.finish.nicknames.length - 1)];
        Exam.share.finalCard = getRandomInt(1, 57);

        if(Exam.gender == 1){
          Exam.share.cardsDirectory = 'm/';
        }else if(Exam.gender == 0){
          Exam.share.cardsDirectory = 'f/';
        }

        Exam.share.prepareShare();
      },

      prepareShare: function(finalNumbers){
        var shareTitleString = 'Мое прозвище в «Арзамасе» '+ Exam.nickname;
        var shareTextString = 'Пройдите интерактивный тест и вступите в «Арзамас»!';

        var shareImage = Exam.share.cardsDomainPath + Exam.share.cardsDirectory + Exam.share.finalCard + '.png';

        var picUrl = encodeURIComponent('890/'+ shareImage);

        var shareTitle = encodeURIComponent(shareTitleString);
        var shareText = encodeURIComponent(shareTextString);

        var shareUrl = encodeURIComponent('http://arzamas.academy/results/875?pic='+ picUrl +'&title='+ shareTitle +'&text='+ shareText);
        var twitterShareUrl = encodeURIComponent('http://arzamas.academy/results/875?pic='+ picUrl);

        $('.social__item_vk .share-button', '.finish__share').attr('href', 'https://vk.com/share.php?url='+ shareUrl);
        $('.social__item_fb .share-button', '.finish__share').attr('href', 'https://www.facebook.com/sharer/sharer.php?u='+ shareUrl);
        $('.social__item_ok .share-button', '.finish__share').attr('href', 'http://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl='+ shareUrl);
        $('.social__item_tw .share-button', '.finish__share').attr('href', 'https://twitter.com/intent/tweet?text='+ shareText +'&original_referer='+ twitterShareUrl +'&url='+ twitterShareUrl);

        var that = this;
        $('.finish__share .share-button').off('click').click(function(e) {
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
      }
    }

  };

//  Exam.currentStep = 6;
//  Exam.currentStepIndex = 5;
//  $('.exam__container .exam__intro').hide();
//  Exam.showCurrentStep();

  $('.exam__container .exam__intro .button').click(function(){
    Exam.start();
  });

});
