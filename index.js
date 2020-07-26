$(function (){
  screenWidthBef = $(window).width();
  screenWidthNow = $(window).width();
  screenHeightBef = $(window).height();
  screenHeightNow = $(window).height();

  tSpeed = 1;
  tNow = new Date().getTime();
  tLast = new Date().getTime();
  homePos = [500, 71];
  playerPos = [homePos[0], homePos[1]];
  playerVelocity = [0, 0];
  playerVelocityBefore = [0, 0];
  playerSize = [0.875, 0.875]
  playerJumping = 0;
  screenStartPos = [141, 262];
  toggleSkill = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  skillTime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  skillTimeM = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  skillCooltime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  skillCooltimeM = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1];
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
                    blockThis[i].push([3e4, 3e4]);
                  } else {
                    worldThis[i].push(7);
                    blockThis[i].push([8000, 8000]);
                  }
                } else {
                  worldThis[i].push(6);
                  blockThis[i].push([2700, 2700]);
                }
              } else {
                worldThis[i].push(5);
                blockThis[i].push([900, 900]);
              }
            } else {
              worldThis[i].push(4);
              blockThis[i].push([140, 140]);
            }
          } else {
            worldThis[i].push(2);
            blockThis[i].push([20+5*(i-84), 20+5*(i-84)]);
          }
        } else {
          if (i > 220 && Math.random() < 0.03+(i-220)/2000) {
            if (i > 240 && Math.random() < 0.15+(i-240)/1500) {
              worldThis[i].push(11);
              blockThis[i].push([1e7, 1e7]);
            } else {
              worldThis[i].push(10);
              blockThis[i].push([2e5, 2e5]);
            }
          } else {
            worldThis[i].push(9);
            blockThis[i].push([8000*(i-199), 8000*(i-199)]);
          }
        }
      }
    }
    for (var i = 0; i < 1000; i++) {
      if (Math.random() < 0.2) {
        worldThis[dirtHeight[i]+74][i] = 104+Math.floor(Math.random()*3);
      }
      if (Math.random() < 0.025) {
        worldThis[dirtHeight[i]+74][i] = 14+Math.floor(Math.random()*2);
        blockThis[dirtHeight[i]+74][i] = [10, 10];
      }
      if (Math.random() < 0.02) {
        woodHeight = Math.floor(Math.random()*6)+4;
        for (var j = 0; j < woodHeight; j++) {
          worldThis[dirtHeight[i]+74-j][i] = 12;
          blockThis[dirtHeight[i]+74-j][i] = [25, 25];
        }
        leafThis = Math.floor(Math.random()*2)+2;
        for (var j = 0; j < leafThis; j++) {
          worldThis[dirtHeight[i]+75-woodHeight][i-leafThis+j] = 13;
          blockThis[dirtHeight[i]+75-woodHeight][i-leafThis+j] = [5, 5];
        }
        leafThis = Math.floor(Math.random()*2)+2;
        for (var j = 0; j < leafThis; j++) {
          worldThis[dirtHeight[i]+75-woodHeight][i+leafThis-j] = 13;
          blockThis[dirtHeight[i]+75-woodHeight][i+leafThis-j] = [5, 5];
        }
        leafThis = Math.floor(Math.random()*2)+1;
        for (var j = 0; j < leafThis; j++) {
          worldThis[dirtHeight[i]+74-woodHeight][i-leafThis+j] = 13;
          blockThis[dirtHeight[i]+74-woodHeight][i-leafThis+j] = [5, 5];
        }
        leafThis = Math.floor(Math.random()*2)+1;
        for (var j = 0; j < leafThis; j++) {
          worldThis[dirtHeight[i]+74-woodHeight][i+leafThis-j] = 13;
          blockThis[dirtHeight[i]+74-woodHeight][i+leafThis-j] = [5, 5];
        }
        worldThis[dirtHeight[i]+74-woodHeight][i] = 13;
        blockThis[dirtHeight[i]+74-woodHeight][i] = [5, 5];
        leafThis = Math.floor(Math.random()*2);
        for (var j = 0; j < leafThis; j++) {
          worldThis[dirtHeight[i]+73-woodHeight][i-leafThis+j] = 13;
          blockThis[dirtHeight[i]+73-woodHeight][i-leafThis+j] = [5, 5];
        }
        leafThis = Math.floor(Math.random()*2);
        for (var j = 0; j < leafThis; j++) {
          worldThis[dirtHeight[i]+73-woodHeight][i+leafThis-j] = 13;
          blockThis[dirtHeight[i]+73-woodHeight][i+leafThis-j] = [5, 5];
        }
        worldThis[dirtHeight[i]+73-woodHeight][i] = 13;
        blockThis[dirtHeight[i]+73-woodHeight][i] = [5, 5];
      }
    }
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 5; j++) {
        worldThis[71-i][498+j] = 103;
        blockThis[71-i][498+j] = [0, 0];
      }
    }
    for (var i = 0; i < 5; i++) {
      worldThis[72][498+i] = 3;
      blockThis[72][498+i] = [1e308, 1e308];
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
    topCollision();
    rightCollision();
    leftCollision();
    // intgerCollision();
  }
  function topCollision() {
    blockIDThis1 = worldThis[Math.floor(playerPos[1]+(1-playerSize[1]))][Math.ceil(playerPos[0]-(1-playerSize[0])/2)];
    blockIDThis2 = worldThis[Math.floor(playerPos[1]+(1-playerSize[1]))][Math.floor(playerPos[0]+(1-playerSize[0])/2)];
    if ((playerVelocity[1] < 0 && (blockIDThis1 <= 100 || blockIDThis2 <= 100))) {
      playerPos[1] += playerVelocityBefore[1]*tGain;
      if (playerPos[1]-Math.floor(playerPos[1]) > 0.9 && playerVelocity[1] < 0.5) {
        playerPos[1] = Math.ceil(playerPos[1])-0.01;
      }
      playerVelocity[1] = 0;
      clearTimeout(jumpOut);
      playerJumping = 0;
      collisionActive[0] = 1;
    }
    if (playerPos[1] < 1) {
      playerPos[1] = 1;
      playerVelocity[1] = 0;
      clearTimeout(jumpOut);
      playerJumping = 0;
      collisionActive[0] = 1;
    }
  }
  function rightCollision() {
    if (playerFPos[0] != playerPos[0]) {
      blockIDThis1 = worldThis[Math.floor(playerPos[1]+(1-playerSize[1]))][Math.ceil(playerPos[0]-(1-playerSize[0])/2)];
      blockIDThis2 = worldThis[playerCPos[1]][Math.ceil(playerPos[0]-(1-playerSize[0])/2)];
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
    blockIDThis1 = worldThis[playerCPos[1]][Math.floor(playerPos[0]+(1-playerSize[0])/2)];
    blockIDThis2 = worldThis[playerCPos[1]][Math.ceil(playerPos[0]-(1-playerSize[0])/2)];
    if ((playerVelocity[1] > 0 && (blockIDThis1 <= 100 || blockIDThis2 <= 100) && !playerJumping) || playerCPos[1] >= 299) {
      playerPos[1] -= playerVelocity[1]*tGain;
      if (playerPos[1]-Math.floor(playerPos[1]) > 0.9 && playerVelocity[1] < 0.5) {
        playerPos[1] = Math.ceil(playerPos[1])-0.01;
      }
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
    if (playerPos[1] > 298) {
      playerPos[1] = 298;
    }
  }
  function leftCollision() {
    if (playerFPos[0] != playerPos[0]) {
      blockIDThis1 = worldThis[Math.floor(playerPos[1]+(1-playerSize[1]))][Math.floor(playerPos[0]+(1-playerSize[0])/2)];
      blockIDThis2 = worldThis[playerCPos[1]][Math.floor(playerPos[0]+(1-playerSize[0])/2)];
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
    if (!toggleSkill[1]) {
      blockIDThis = worldThis[yPos][xPos];
      if (blockIDThis <= 100) {
        blockThis[yPos][xPos][0] -= playerAtk*tGain;
        if (blockThis[yPos][xPos][0] < 0) {
          worldThis[yPos][xPos] = 103;
        }
      }
    }
  }
  function skillActive(skillNum) {
    if (skillCooltime[skillNum] < 0) {
      skillCooltime[skillNum] = skillCooltimeM[skillNum];
      skillTime[skillNum] = skillTimeM[skillNum];
      switch (skillNum) {
        case 0:
          playerPos = [homePos[0], homePos[1]];
          break;
        case 1:
          toggleSkill[1] = !toggleSkill[1];
          break;
        case 2:
          toggleSkill[2] = !toggleSkill[2];
          break;
      }
    }
  }

  function gameTick() {
    setPlayerVar();
    movePlayer();
    displayPlayer();
    displayMap();
    displaySkill();
  }
  function setPlayerVar() {
    playerFPos = [0, 0];
    playerFPos = [Math.floor(playerPos[0]), Math.floor(playerPos[1])];
    playerCPos = [Math.ceil(playerPos[0]), Math.ceil(playerPos[1])];
    playerRPos = [Math.round(playerPos[0]), Math.round(playerPos[1])];
    playerDPos = [Math.floor(playerFPos[0])-playerPos[0], Math.floor(playerFPos[1])-playerPos[1]];
    screenStartPos = [playerFPos[0]-7, playerFPos[1]-7];
    playerAtk = 3;
  }
  function movePlayer() {
    vSpeed = 10;
    pVolGain = tGain*vSpeed;
    if (keypress['39']) {
      if (!toggleSkill[2]) {
        blockMine(playerRPos[0]+1, playerRPos[1]);
      }
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
      if (!toggleSkill[2]) {
        blockMine(playerRPos[0]-1, playerRPos[1]);
      }
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
      if (!toggleSkill[2]) {
        blockMine(playerRPos[0], playerRPos[1]-1);
      }
      if (touchedBottom && !playerJumping) {
        playerJumping = 1;
        playerVelocity[1] = 0;
        jumpOut = setTimeout( function () {
          playerJumping = 0;
        }, 700);
      }
    } else if (!keypress['38']) {
      playerJumping = 0;
      clearTimeout(jumpOut);
    }
    if (keypress['40']) {
      if (!toggleSkill[2]) {
        blockMine(playerRPos[0], playerRPos[1]+1);
      }
    }
    if (keypress['72']) {
      skillActive(0);
    }
    if (keypress['77']) {
      skillActive(1);
    }
    if (keypress['65']) {
      skillActive(2);
    }
    if (toggleSkill[2]) {
      blockMine(playerRPos[0]+1, playerRPos[1]);
      blockMine(playerRPos[0]-1, playerRPos[1]);
      blockMine(playerRPos[0], playerRPos[1]-1);
      blockMine(playerRPos[0], playerRPos[1]+1);
    }
    playerPos[0] -= tGain*playerVelocity[0];
    overallCollision();
    if (playerJumping == 1) {
      playerVelocity[1] -= 10*tGain;
    }
    playerVelocityBefore = playerVelocity;
  }
  function displayPlayer() {
    $('#innerScreenArea').css('left', ((playerDPos[0])*8-8).toFixed(9) + 'vh').css('top', ((playerDPos[1])*8-8).toFixed(9) + 'vh');
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
        if (thisBlockStatus >= 6) {
          thisBlockStatus = 0;
        }
        $('.mapLine:eq(' + i + ') > .mapBlock:eq(' + j + ')').css('background-image', 'url(Resoruce/BlockBreak/' + thisBlockStatus + '.png), url(Resoruce/Block/' + thisImgID + '.png)');
      }
    }
  }
  function displaySkill() {
    for (var i = 0; i < skillCooltime.length; i++) {
      skillCooltime[i] -= tGain;
      skillTime[i] -= tGain;
      if (skillCooltime[i] < 0) {
        $('.skill:eq(' + i + ')').css('opacity', 1);
      } else {
        $('.skill:eq(' + i + ')').css('opacity', 1-skillCooltime[i]/skillCooltimeM[i]);
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
