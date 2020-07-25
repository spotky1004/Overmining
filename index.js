$(function (){
  screenWidthBef = $(window).width();
  screenWidthNow = $(window).width();
  screenHeightBef = $(window).height();
  screenHeightNow = $(window).height();

  tSpeed = 1;
  tNow = new Date().getTime();
  tLast = new Date().getTime();
  playerPos = [500, 74];
  playerVelocity = [0, 0];
  playerVelocityBefore = [0, 0];
  playerJumping = 0;
  screenStartPos = [141, 262];
  worldThis = [];
  blockThis = [];
  jumpOut = 0;
  xCollAct = 0;
  touchedBottom = 0;
  menuSel = -1;
  playerHP = 100;

  function fixEtc() {
    screenWidthNow = $(window).width();
    screenHeightNow = $(window).height();
    if (screenHeightNow != screenWidthBef || screenWidthNow != screenWidthBef) {
      centerScreen();
    }
    screenWidthBef = screenWidthNow;
    screenHeightBef = screenHeightNow;
  }
  function centerScreen() {
    if (screenHeightNow*1.2 < screenWidthNow || 1) {
      $('#screenArea').css('left',  (screenWidthNow*0.5-screenHeightNow*0.6)/screenHeightNow*100 + 'vh');
      $('#inventoryArea').css('left',  (screenWidthNow*0.5-screenHeightNow*0.5)/screenHeightNow*100 + 'vh');
      $('#playerArea').css('left',  (screenWidthNow*0.5-screenHeightNow*0.04)/screenHeightNow*100 + 'vh');
    }
  }
  function crateElements() {
    for (var i = 0; i < 12; i++) {
      $('<div>').addClass('mapLine').appendTo('#innerScreenArea');
    }
    for (var i = 0; i < 17; i++) {
      $('<span>').addClass('mapBlock').appendTo('.mapLine');
    }
  }

  function worldGen() {
    dirtHeight = [];
    dHthis = 5;
    for (var i = 0; i < 1000; i++) {
      dHthis += Math.floor(Math.random()*5)-2;
      if (dHthis < 0) {
        dHthis = 0;
      }
      if (dHthis > 5) {
        dHthis = 5;
      }
      dirtHeight.push(dHthis);
    }
    for (var i = 0; i < 300; i++) {
      worldThis.push([]);
      blockThis.push([]);
      for (var j = 0; j < 1000; j++) {
        if (i < 20) {
          worldThis[i].push(102);
          blockThis[i].push([0, 0]);
        } else if (i < 75) {
          worldThis[i].push(101);
          blockThis[i].push([0, 0]);
        } else if (i < 85) {
          hThis = i-75;
          if (dirtHeight[j] == hThis) {
            worldThis[i].push(0);
            blockThis[i].push([10, 10]);
          } else if (dirtHeight[j] < hThis) {
            worldThis[i].push(1);
            blockThis[i].push([5, 5]);
          } else {
            worldThis[i].push(101);
            blockThis[i].push([0, 0]);
          }
        } else if (i < 200){
          if (i > 95 && Math.random() < 0.1+(i-96)/300) {
            if (i > 115 && Math.random() < 0.15+(i-115)/250) {
              if (i > 135 && Math.random() < 0.2+(i-135)/200) {
                if (i > 155 && Math.random() < 0.25+(i-155)/150) {
                  if (i > 175 && Math.random() < 0.3+(i-175)/100) {
                    worldThis[i].push(8);
                    blockThis[i].push([4000, 4000]);
                  } else {
                    worldThis[i].push(7);
                    blockThis[i].push([2000, 2000]);
                  }
                } else {
                  worldThis[i].push(6);
                  blockThis[i].push([600, 600]);
                }
              } else {
                worldThis[i].push(5);
                blockThis[i].push([130, 13]);
              }
            } else {
              worldThis[i].push(4);
              blockThis[i].push([60, 60]);
            }
          } else {
            worldThis[i].push(2);
            blockThis[i].push([20+5*(i-84), 20+5*(i-84)]);
          }
        } else {
          if (i > 220 && Math.random() < 0.03+(i-220)/2000) {
            if (i > 240 && Math.random() < 0.15+(i-240)/1500) {
              worldThis[i].push(11);
              blockThis[i].push([1e6, 1e6]);
            } else {
              worldThis[i].push(10);
              blockThis[i].push([8e4, 8e4]);
            }
          } else {
            worldThis[i].push(9);
            blockThis[i].push([4000*(i-199), 4000*(i-199)]);
          }
        }
      }
    }
  }

  keypress = {};
	$(document).keydown(function(e){
		keypress[e.which.toString()] = true;
	});
	$(document).keyup(function(e){
		keypress[e.which.toString()] = false;
	});

  function overallCollision() {
    collisionActive = [0, 0, 0, 0];
    bottomCollision();
    rightCollision();
    leftCollision();
    topCollision();
    // intgerCollision();
  }
  function topCollision() {
    blockIDThis1 = worldThis[playerFPos[1]][playerFPos[0]];
    blockIDThis2 = worldThis[playerFPos[1]][playerCPos[0]];
    if ((playerVelocity[1] < 0 && (blockIDThis1 <= 100 || blockIDThis2 <= 100)) || playerFPos[1] < 1) {
      playerPos[1] -= playerVelocityBefore[1]*tGain;
      playerVelocity[1] = 0;
      clearTimeout(jumpOut);
      playerJumping = 0;
      collisionActive[0] = 1;
    }
  }
  function rightCollision() {
    if (playerFPos[0] != playerPos[0]) {
      blockIDThis1 = worldThis[playerFPos[1]][playerCPos[0]];
      blockIDThis2 = worldThis[playerCPos[1]][playerCPos[0]];
      if (playerVelocity[0] < 0 && (blockIDThis1 <= 100 || blockIDThis2 <= 100)) {
        playerPos[0] += playerVelocityBefore[0]*tGain;
        playerVelocity[0] = 0;
        xCollAct = 1;
        collisionActive[1] = 1;
      } else {
        xCollAct = 0;
      }
    }
  }
  function bottomCollision() {
    blockIDThis1 = worldThis[playerCPos[1]][playerFPos[0]];
    blockIDThis2 = worldThis[playerCPos[1]][playerCPos[0]];
    if (playerVelocity[1] > 0 && (blockIDThis1 <= 100 || blockIDThis2 <= 100) && !playerJumping) {
      playerPos[1] -= playerVelocityBefore[1]*tGain;
      playerVelocity[1] = 0;
      touchedBottom = 1;
      collisionActive[2] = 1;
    } else {
      playerVelocity[1] += 4*tGain;
      if (playerVelocity[1] > 12) {
        playerVelocity[1] = 12;
      }
      playerPos[1] += playerVelocity[1]*tGain;
      touchedBottom = 0;
    }
  }
  function leftCollision() {
    if (playerFPos[0] != playerPos[0]) {
      blockIDThis1 = worldThis[playerFPos[1]][playerFPos[0]];
      blockIDThis2 = worldThis[playerCPos[1]][playerFPos[0]];
      if (playerVelocity[0] > 0 && (blockIDThis1 <= 100 || blockIDThis2 <= 100)) {
        playerPos[0] += tGain*playerVelocity[0];
        playerVelocity[0] = 0;
        xCollAct = 1;
        collisionActive[3] = 1;
      } else {
        xCollAct = 0;
      }
    }
  }
  function intgerCollision() {
    collisionFix = [0, 0, 0, 0];
    if (collisionActive[0]) {

    }
    if (collisionActive[1]) {

    }
    if (collisionActive[2]) {

    }
    if (collisionActive[3]) {

    }
  }

  function blockMine(xPos, yPos) {
    blockIDThis = worldThis[yPos][xPos];
    if (blockIDThis <= 100) {
      blockThis[yPos][xPos][0] -= playerAtk*tGain;
      if (blockThis[yPos][xPos][0] < 0) {
        worldThis[yPos][xPos] = 103;
      }
    }
  }

  function gameTick() {
    setPlayerVar();
    movePlayer();
    displayPlayer();
    displayMap();
  }
  function setPlayerVar() {
    playerFPos = [0, 0];
    playerFPos = [Math.floor(playerPos[0]), Math.floor(playerPos[1])];
    playerCPos = [Math.ceil(playerPos[0]), Math.ceil(playerPos[1])];
    playerRPos = [Math.round(playerPos[0]), Math.round(playerPos[1])];
    playerDPos = [Math.floor(playerFPos[0])-playerPos[0], Math.floor(playerFPos[1])-playerPos[1]];
    screenStartPos = [playerFPos[0]-7, playerFPos[1]-7];
    playerAtk = 10;
  }
  function movePlayer() {
    vSpeed = 10;
    pVolGain = tGain*vSpeed;
    if (keypress['39']) {
      blockMine(playerRPos[0]+1, playerRPos[1]);
      playerVelocity[0] -= pVolGain;
      if (playerVelocity[0] < -5) {
        playerVelocity[0] = -5;
      }
    } else if (playerVelocity[0] < 0) {
      playerVelocity[0] += pVolGain/3;
      if (playerVelocity[0] > 0) {
        playerVelocity[0] = 0;
      }
    }
		if (keypress['37']) {
      blockMine(playerRPos[0]-1, playerRPos[1]);
      playerVelocity[0] += pVolGain;
      if (playerVelocity[0] > 5) {
        playerVelocity[0] = 5;
      }
    } else if (playerVelocity[0] > 0) {
      playerVelocity[0] -= pVolGain/3;
      if (playerVelocity[0] < 0) {
        playerVelocity[0] = 0;
      }
    }
    if (keypress['38']) {
      blockMine(playerRPos[0], playerRPos[1]-1);
      if (touchedBottom && !playerJumping) {
        playerJumping = 1;
        playerVelocity[1] = 0;
        jumpOut = setTimeout( function () {
          playerJumping = 0;
        }, 600);
      }
    } else if (!keypress['38']) {
      playerJumping = 0;
      clearTimeout(jumpOut);
    }
    playerPos[0] -= tGain*playerVelocity[0];
    overallCollision();
    if (playerJumping == 1) {
      playerVelocity[1] -= 10*tGain;
    }
    playerVelocityBefore = playerVelocity;
    if (keypress['40']) {
      blockMine(playerRPos[0], playerRPos[1]+1);
    }
    if (keypress['72']) {
      playerPos = [500, 73];
    }
  }
  function displayPlayer() {
    $('#innerScreenArea').css('left', ((playerDPos[0])*8-8).toFixed(1) + 'vh').css('top', ((playerDPos[1])*8-8).toFixed(2) + 'vh');
  }
  function displayMap() {
    for (var i = 0; i < 12; i++) {
      thisBlockY = screenStartPos[1]+1+i;
      for (var j = 0; j < 17; j++) {
        thisBlockX = screenStartPos[0]-1+j;
        thisBlockStatus = 0
        if ((0 <= thisBlockX && thisBlockX < 1000) && (0 <= thisBlockY && thisBlockY < 300)) {
          thisImgID = worldThis[thisBlockY][thisBlockX];
          thisBlockHP = blockThis[thisBlockY][thisBlockX];
          thisBlockHPP = thisBlockHP[0]/thisBlockHP[1];
          if (isNaN(thisBlockHPP) || 1 < thisBlockHPP) {
            thisBlockHPP = 1;
          }
          thisBlockStatus = Math.floor((1-thisBlockHPP)*6);
        } else {
          thisImgID = 3;
        }
        $('.mapLine:eq(' + i + ') > .mapBlock:eq(' + j + ')').css('background-image', 'url(Resoruce/BlockBreak/' + thisBlockStatus + '.png), url(Resoruce/Block/' + thisImgID + '.png)');
      }
    }
  }

  $(document).on('click','.inventoryNav',function() {
    indexThis = $('.inventoryNav').index(this);
    console.log(indexThis);
    if (menuSel != indexThis) {
      menuSel = indexThis;
      $('.inventoryNav').removeClass('activeMenu');
      $('.inventoryNav:eq(' + indexThis + ')').addClass('activeMenu');
    } else {
      menuSel = -1;
      $('.inventoryNav:eq(' + indexThis + ')').removeClass('activeMenu');
    }
  });

  setInterval( function () {
    fixEtc();
  }, 100);
  setInterval( function () {
    tNow = new Date().getTime();
    tGain = 0.033;
    gameTick();
    tLast = tNow;
  }, 33);

  crateElements();
  centerScreen();
  worldGen();
});
