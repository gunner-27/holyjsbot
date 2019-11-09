let { x, y } = API.getCurrentPosition();
let actionPoints = API.getActionPointsCount();
let enemies = API.getEnemies();
let enemiesNear = [];
let nearEnemiesCount = 0;
let newX, newY;

enemies.forEach(enemy => {
  enemy.distance = getDistance(x, y, enemy.position);
  if (enemy.distance < 4) {
    nearEnemiesCount++;
    enemiesNear.push(enemy);
  }
});

if (nearEnemiesCount == 0) {
  if (enemies.length == 1) {
    hunt(x, y);
  } else {
    let places = findSafePlaces(x, y);
    let place = findBestPlace(places);
    newX = place.x, newY = place.y;
    API.move(newX, newY);
  }

} else {
  let flag = 1;
  enemiesNear.forEach(enemy => {
    if (isSafePlace(enemy.position.x, enemy.position.y)) {
      newX = enemy.position.x;
      newY = enemy.position.y;
      flag = 0;
    }
  });
  if (flag) {
    let places = findSafePlaces(x, y);
    if (places.length != 0) {
      let place = findBestPlace(places);
      newX = place.x, newY = place.y;
    } else {
      newX = enemiesNear[0].position.x;
      newY = enemiesNear[0].position.y;
    }
  }
  API.move(newX, newY);
}

function getDistance(x, y, enemyPosition) {
  let total;
  total = Math.abs(enemyPosition.x - x) + Math.abs(enemyPosition.y - y);
  return total;
}

function isSafePlace(x, y) {
  let nearEnemiesC = 0;
  enemies.forEach(enemy => {
    enemy.distance = getDistance(x, y, enemy.position);
    if (enemy.distance < 4) {
      if (enemy.position.x != x && enemy.position.y != y) {
        nearEnemiesC++;
      }
    }
  });
  if (nearEnemiesC == 0) {
    return true;
  } else {
    return false;
  }
}

function findSafePlaces(x, y) {
  let places = findAvailablePlaces(x, y);
  let safePlaces = [];
  places.forEach(place => {
    if (isSafePlace(place.x, place.y)) {
      safePlaces.push(place);
    }
  });

  return safePlaces;
}

function findAvailablePlaces(x, y) {
  let places = [];
  let xMin = x > 2 ? x - 3 : 0;
  let xMax = x < 6 ? x + 3 : 8;
  let yMin = y > 2 ? y - 3 : 0;
  let yMax = y < 6 ? y + 3 : 8;

  for (let i = xMin; i < xMax + 1; i++) {
    for (let j = yMin; j < yMax + 1; j++) {
      if (i != x && j != y) {
        places.push({ x: i, y: j });
      }
    }
  }
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

function findNearCorner(x, y) {
  let xm = x < 4 ? 0 : 8;
  let ym = y < 4 ? 0 : 8;
  return ({ xm, ym });
}

function hunt(x, y) {
  let xV = 0;
  let yV = 0;
 let dis = getDistance(x, y, enemies[0].position);
 let xVector = enemies[0].position.x - x;
 let yVector = enemies[0].position.y - y;
 xV = xVector > 4 ? x+1*(Math.sign(xVector)) : 0;
 yV = yVector > 4 ? y+1*(Math.sign(yVector)) : 0;
  if (xV != 0 && yV != 0) {
    API.move(xV, yV);
  } else {
    let places = findSafePlaces(x, y);
    let place = findBestPlace(places);
    xV = place.x, yV = place.y;
    API.move(xV, yV);
  }
 }
