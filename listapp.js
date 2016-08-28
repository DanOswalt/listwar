$(function () {

  //declarations///////////////////////////////////////////////////////////////
  
  var totalBattles = 0,
      playerCount = 0,
      currentBattle = 1,
      schedule = [],
      nonblankCount = 0,
      field,
      page = "input";
 
  var $inputFields = $('form input'),
      $form = $('form'),
      $p = $('p'),
      $submit = $('#submit-button'),
      $clear = $('#clearButton'),
      $help = $('#helpButton'),
      $battleBox = $('#battleBox'),
      $battleButton = $('.battleButton'),
      $topButton = $('#topButton'),
      $bottomButton = $('#bottomButton'),
      $progress = $('#progress');
  
  var players = [
      Player1 = new Player, 
      Player2 = new Player,
      Player3 = new Player,
      Player4 = new Player, 
      Player5 = new Player, 
      Player6 = new Player,
      Player7 = new Player,
      Player8 = new Player,
      Player9 = new Player, 
      Player10 = new Player
      ];
  
  function Player() {
    this.name = "";
    this.wins = 0;
    this.tiebreak = Math.random() / 100;//this is for unbreakable tiebreaks later
    this.vanquished = [];
  };
  
  //ui functions///////////////////////////////////////////////////////////////
  
  function clearFields() {
    $.each($inputFields, function (index) {
      field = $inputFields[index];
      if (field.value.length > 0) {
        $(field).val('').css('border', 'none');
      };
    });
  }
  
  function updateSubmitMessage() {
    $submit.removeClass('active').prop('disabled', true);
    
    if (page === "results") {
      $submit.addClass('active').prop('disabled', false);
      return "Play Again!";
    } else if (playerCount < 4) {
      return "Enter at least 4 items"
    } else {
      $submit.addClass('active').prop('disabled', false);
      return "Submit " + playerCount + " items (" + totalBattles + " battles)";
    }  
  }
       
  function loadNextBattle() {
    var msg = "Battle " + currentBattle + " out of " + totalBattles;
    
    $progress.text(msg);
    
    $topButton.text(schedule[currentBattle - 1][0].name);
    $bottomButton.text(schedule[currentBattle - 1][1].name);
    
    if(currentBattle > 1) {
      $battleBox.fadeIn('fast');
    }
    
  }
  
  function segueToBattles() {
    page = "battles";
    
    $form.slideUp(600);
    $battleBox.delay(500).slideDown(600);
  }
  
  function segueToResults() {
    page = "results";
    
    $battleBox.slideUp(600);
    clearFields();
    $submit.text(updateSubmitMessage());
    $p.delay(200).hide();
    
    $form.delay(500).slideDown(600);

    for(var i = 0; i < playerCount; i++) {
    
      field = $inputFields[i];
      $(field).val(players[i].resultMsg); 
    
    }
     
  }
  
  //app functions///////////////////////////////////////////////////////////////
  
  function newGame() {
            
    totalBattles = 0;
    playerCount = 0;
    currentBattle = 1;
    schedule = [];
    nonblankCount = 0;
    field;
    page = "input";
    players = [
      Player1 = new Player, 
      Player2 = new Player,
      Player3 = new Player,
      Player4 = new Player, 
      Player5 = new Player, 
      Player6 = new Player,
      Player7 = new Player,
      Player8 = new Player,
      Player9 = new Player, 
      Player10 = new Player
      ];
    
    clearFields();
    $submit.text(updateSubmitMessage());
    $('p').show();

  }
  
  function getPlayerList() {
    var names = [], 
        count = 0;
  
    $.each($inputFields, function (index) {
      field = $inputFields[index];
      if (field.value.length > 0) {
        names.push($(field).val());
      };
    });
    
    for(var i = 0; i < names.length ; i++) {
      players[i].name = names[i];
    }

  }
    
  function getMatchups() {
    var allPossibleMatchups = [
      [Player1,Player2], //2
      
      [Player1,Player3],[Player2,Player3], //3
      
      [Player1,Player4],[Player2,Player4],[Player3,Player4],  //4
      
      [Player1,Player5],[Player2,Player5],[Player3,Player5],[Player4,Player5],  //5
      
      [Player1,Player6],[Player2,Player6],[Player3,Player6],[Player4,Player6],[Player5,Player6], //6
      
      [Player1,Player7],[Player2,Player7],[Player3,Player7],[Player4,Player7],[Player5,Player7],
      [Player6,Player7], //7
      
      [Player1,Player8],[Player2,Player8],[Player3,Player8],[Player4,Player8],[Player5,Player8],
      [Player6,Player8],[Player7,Player8], //8
      
      [Player1,Player9],[Player2,Player9],[Player3,Player9],[Player4,Player9],[Player5,Player9],
      [Player6,Player9],[Player7,Player9],[Player8,Player9], //9
      
      [Player1,Player10],[Player2,Player10],[Player3,Player10],[Player4,Player10],[Player5,Player10],
      [Player6,Player10],[Player7,Player10],[Player8,Player10],[Player9,Player10] //10  
    ];
    
    schedule = allPossibleMatchups.slice(0,totalBattles);
  }
  
  //Ficher-Yates shuffle algorithm    
  function shuffle(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }
  
  function calcResults() {
    
    var hero, villain, i;
    
    //handle tiebreaks:
    
    //cycle through each 'hero'
    for(hero = 0; hero < playerCount; hero++) {

      console.log("Vanquished list for: " + players[hero].name)
      console.log(players[hero].vanquished);
      
      //cycle through all of the hero's 'villains', skip own index
      for(villain = 0; villain < playerCount; villain++) {
        
        //skip own index
        if(hero === villain) continue;
        console.log("Villain #" + villain + " " + players[villain].name);
        
        //if hero and villain have same number of wins, check the head-to-head result
        if(players[hero].wins === players[villain].wins) {
          
          for(i = 0; i < players[hero].vanquished.length; i++) {
            
            //if the hero beat the villain, give him 0.1 points
            if(players[villain].name === players[hero].vanquished[i]) {
              players[hero].tiebreak += 0.1;
              break;
            }
          }  
        }
      }
    }
    
    for(i = 0; i < playerCount; i++) {
      players[i].score = players[i].wins + players[i].tiebreak;
    }
    
    console.log("****Actual Scores*******");
    console.log(Player1.name + " " + Player1.score);
    console.log(Player2.name + " " + Player2.score);
    console.log(Player3.name + " " + Player3.score);
    console.log(Player4.name + " " + Player4.score);
    
    //sort from highest to lowest    
    players.sort(function(b, a) {
      return parseFloat(a.score) - parseFloat(b.score);
    }); 
    
    console.log("****Sorted Scores*******");
    console.log(players[0].name + " " + players[0].score);
    console.log(players[1].name + " " + players[1].score);
    console.log(players[2].name + " " + players[2].score);
    console.log(players[3].name + " " + players[3].score);
    
    for(i = 0; i < playerCount; i++) {
      var rank = i + 1;
      players[i].resultMsg = rank + '. ' + players[i].name + ' ' + players[i].wins + ' pts';  
    }

  }
  
  //events///////////////////////////////////////////////////////////////
  
  //on each new keystroke in form, sum nonblank fields and update data
  $inputFields.on('focus', function() {
    $(this).css('border', 'solid 2px #4bc970',
                'background-color', '#e8eeef');
  })
  $inputFields.on('click', function() {
    $(this).css('border', 'solid 2px #4bc970',
                'background-color', '#e8eeef');
  })

  $inputFields.on('blur', function() {
    if($(this).val() === "") {
      $(this).css('border', 'none');
    } else {
      $(this).css('border', 'solid 2px #111',
                'background-color','#e8eeef');
    }
  })

  $inputFields.on('keydown', function() {

    playerCount = 0;
  
    $.each($inputFields, function (index) {
      field = $inputFields[index];
      if (field.value.length > 0) {
        playerCount += 1;
      }
    });
   
    totalBattles = playerCount * (playerCount - 1) / 2;
   
    $submit.text(updateSubmitMessage());
  });
  
  $submit.click( function () {
    
    if(page === "input") {
      getPlayerList();
      getMatchups();
      shuffle(schedule);
      segueToBattles();
      loadNextBattle();
    } else {
      newGame();
    }  
  });
  
  $battleButton.click( function() {
    
    var topPlayer = schedule[currentBattle - 1][0];
    var bottomPlayer = schedule[currentBattle - 1][1];
    var selected = $(this).attr('id');
    
    if(selected === 'topButton') {
      topPlayer.wins += 1;
      topPlayer.vanquished.push(bottomPlayer.name);
    } else {
      bottomPlayer.wins += 1;
      bottomPlayer.vanquished.push(topPlayer.name);
    }
    
    currentBattle += 1;
    
    $battleBox.fadeOut('fast');
    
    if(currentBattle > totalBattles) {
      calcResults();
      segueToResults();
    } else {     
      setTimeout(function(){ loadNextBattle() }, 200);
    }
    
  });
  
  //on document load//////////////////////////////////////////////////////////////////////
  $submit.text(updateSubmitMessage());

});