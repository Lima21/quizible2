start();

//Initialize vars
var pergunta;
var pontos;
var perguntas;
var correta;
var selected;
var start;

//Annyang
window.onload = function () {
    if (annyang) {
        var commands = {
            'number *text': selecionar
        };
        annyang.addCommands(commands);

        annyang.debug();
        annyang.start();
    }
}


function novaPergunta() {
    //$('#bar').css('transition', '0s');
    start = 60;
    $('#bar').css('width', '100%');
    $('#bar').removeClass('d-none');
    $('#estado').text("Q" + (pergunta + 1));

    correta = Math.floor((Math.random() * 4) + 1);
    let nCorreta = correta - 1;

    for (let i = 0; i < 4; i++) {
        if (i == nCorreta) {
            $('#resp' + (i + 1)).html(perguntas.results[pergunta].correct_answer);
        } else if (i > nCorreta) {
            $('#resp' + (i + 1)).html(perguntas.results[pergunta].incorrect_answers[i - 1]);
        } else {
            $('#resp' + (i + 1)).html(perguntas.results[pergunta].incorrect_answers[i]);
        }
    }
    $('#pergunta').html(perguntas.results[pergunta].question);
    $('#category').html('Category: ' + perguntas.results[pergunta].category);
    

    reduzir();
    

}


function reduzir() {
    setTimeout(function () {
      
      if(!selected){
        start = start - 2;
        let perc = start * 100 / 60;
        perc += '%';
        $('#bar').css('width', perc);
        console.log(start);
        reduzir();
        if(start <= 0) {
            selecionar(5);
        }
      }
    }, 400);
    
}

function selecionar(escolha) {
    if (!selected) {
        selected = true;

       // $('#bar').addClass('d-none');
        if (!Number.isInteger(parseInt(escolha))) {
            switch (escolha) {
                case 'one':
                    escolha = 1;
                    break;
                case 'two':
                    escolha = 2;
                    break
                case 'three':
                    escolha = 3;
                    break;
                case 'for':
                case 'four':
                    escolha = 4;
                    break
            }
        }

        if (Number.isInteger(parseInt(escolha))) {
            $('#resp' + correta).css('background-color', '#7FFF00');
            if (escolha == correta) {
                pontos++;
                $('#points').text('Points: ' + pontos);
                var audio = new Audio('assets/audio/palmas.mp3');
                audio.play();

            } else {
                $('#resp' + escolha).css('background-color', '#CD5C5C');
                var audio = new Audio('assets/audio/fail.mp3');
                audio.play();
            }

            if (pergunta >= 9) {

                document.location.href = 'end.html?points=' + pontos;
            } else {
                setTimeout(function () {
                    $('#resp' + correta).css('background-color', 'transparent');
                    $('#resp' + escolha).css('background-color', 'transparent');
                    pergunta++;

                    novaPergunta();
                    selected = false;

                }, 2000);
            }
        } else {
            console.log("not number");
        }
    }
}




function start() {
    var urlParams = new URLSearchParams(window.location.search);

    var category = urlParams.get('category');
    var difficulty = urlParams.get('difficulty');


    if (difficulty == 'any') {
        difficulty = '';
    } else {
        difficulty = '&difficulty=' + difficulty;
    }

    pergunta = 0;
    pontos = 0;
    $.get('https://opentdb.com/api.php?amount=10&type=multiple&category=' + category + difficulty, function (data) {
        perguntas = data;
        console.log(perguntas);
        if (data.response_code != 0) {
            var instance = new TypeIt('#erro', {
                strings: ['Ocorreu um erro ao pesquisar as perguntas']
                // other options
            });

        } else {
            novaPergunta();
            $('.l').addClass('d-none');
            $('.s').removeClass('d-none');
            
            selected = false;
        }

    });
}