let { x, y } = API.getCurrentPosition();
let actionPoints = API.getActionPointsCount();
let enemies = API.getEnemies();
let enemiesNear = 0;

enemies.forEach(enemy => {
  enemy.distance = getDistance(x, y, enemy.position);
  if (enemy.distance < actionPoints) {
    enemiesNear++;
  }
});

if (enemiesNear == 0) {
  let places = findSafePlaces(x, y);
  if (places.length != 0) {
    let place = findBestPlace(places);
    API.move(place.x, place.y);
  }
} else {
  let xNew, yNew;
  let flag = 1;
  enemies.forEach(enemy => {
    enemy.distance = getDistance(x, y, enemy.position);
    if (enemy.distance < actionPoints) {
      if (isSafePlace(enemy.position.x, enemy.position.y)) {
        flag = 0;
        xNew = enemy.position.x;
        yNew = enemy.position.y;
      }
    }
  });
  if (flag) {
    let places = findSafePlaces(x, y);
    if (places.length != 0) {
      let place = findBestPlace(places);
      xNew = place.x;
      yNew = place.y;
    } else {
      let { mX, mY } = getNearEnemy(enemies, actionPoints);
      xNew = mX;
      yNew = mY;
    }
  }
  API.move(xNew, yNew);
}

function getDistance(x, y, enemyPosition) {
  let xDistance, yDistance, total;
  xDistance = enemyPosition.x > x ? enemyPosition.x - x : x - enemyPosition.x;
  yDistance = enemyPosition.y > y ? enemyPosition.y - y : y - enemyPosition.y;
  total = xDistance + yDistance;
  return total;
}

function getNearEnemy(enemies, actionPoints) {
  let nearEnemies = [];
  let maxEnemies = 10;
  let mX, mY;
  enemies.forEach(enemy => {
    if (enemy.distance < actionPoints) {
      nearEnemies.push(enemy);
    }
  });
  nearEnemies.forEach(enemy => {
    enemy.enemiesAround = countNearEnemies(enemy.position.x, enemy.position.y, actionPoints);
    if (enemy.enemiesAround < maxEnemies) {
      maxEnemies = enemy.enemiesAround;
      mX = enemy.position.x;
      mY = enemy.position.y;
    }
  });
  return ({ mX, mY });
}

function countNearEnemies(x, y, actionPoints) {
  let enemiesNear = 0;
  enemies.forEach(enemy => {
    enemy.distance = getDistance(x, y, enemy.position);
    if (enemy.distance < actionPoints && enemy.distance > 0) {
      enemiesNear++;
    }
  });
  return enemiesNear;
}

function findNearCorner(x, y) {
  let xm, ym;
  if (x < 4) {
    xm = 0;
  } else {
    xm = 8;
  };
  if (y < 4) {
    ym = 0;
  } else {
    ym = 8;
  }
  return ({ xm, ym });
}


function findSafePlaces(x, y) {
  let places = findAvailablePlaces(x, y);
  let safePlaces = [];
  places.forEach(place => {
    let enemiesAround = countNearEnemies(place.x, place.y, 4);
    if (enemiesAround == 0) {
      safePlaces.push(place);
    }
  });
  return safePlaces;
}

function findAvailablePlaces(x, y) {
  let places = [];
  let xMin, xMax, yMin, yMax;
  if (x > 2) {
    xMin = x - 3;
  } else {
    xMin = 0;
  }
  if (x < 6) {
    xMax = x + 3;
  } else {
    xMax = 8;
  }

  if (y > 2) {
    yMin = y - 3;
  } else {
    yMin = 0;
  }
  if (y < 6) {
    yMax = y + 3;
  } else {
    yMax = 8;
  }

  for (let i = xMin; i < xMax; i++) {
    for (let j = yMin; j < yMax; j++) {
      places.push({ x: i, y: j });
    }
  }
  let pos = 0;
  places.forEach((element, i) => {
    if (element.x == x && element.y == y) {
      pos = i;
    }
  });
  places.splice(pos, 1);
  return (places);
}

function findBestPlace(places) {
  let bestplace;
  let MaxDistance = 9999;
  places.forEach(place => {
    let { xm, ym } = findNearCorner(place.x, place.y);
    let total = getDistance(xm, ym, place);
    if (total <= MaxDistance) {
      MaxDistance = total;
      bestplace = place;
    };
  });
  return bestplace;
}

function isSafePlace(x, y) {
  let nearEnemies = countNearEnemies(x, y, 3);
  if (nearEnemies == 0) {
    return true;
  } else {
    return false;
  }
}
