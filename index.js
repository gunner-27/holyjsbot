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
  let xm;
  if (x > 4) {
    xm = x -1;
   }
  else {
    xm = x+1;
  }
  API.move(xm, y);
} else {
  let {mX, mY} = getNearEnemy(enemies, actionPoints);
  API.move(mX, mY); 
}

function getDistance(x, y, enemyPosition) {
  let xDistance, yDistance, total;
  xDistance = enemyPosition.x > x ? enemyPosition.x - x : x - enemyPosition.x;
  yDistance = enemyPosition.y > y ? enemyPosition.y - y : y - enemyPosition.y;
  total = xDistance+yDistance;
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
  return ({mX, mY});
}

function countNearEnemies(x, y, actionPoints) {
  let enemiesNear = 0;
  enemies.forEach(enemy => {
    enemy.distance = getDistance(x, y, enemy.position); 
    if (enemy.distance < actionPoints) {
      enemiesNear++;
    }
  });
  return enemiesNear;
}
