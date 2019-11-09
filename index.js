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
  let { xm, ym } = findNearCorner(x, y);
  if (x != xm) {
    let Ypoints = actionPoints - Math.abs(xm - x);
    if (Ypoints > -1) {
      if (Math.abs(ym - y) <= Ypoints) {
        API.move(xm, ym);
      } else {
        ym = Math.sign(ym - y) * Ypoints;
        API.move(xm, ym);
      }
    } else {
      ym = 0;
      xm = Math.sign(xm - x) * actionPoints;
      API.move(xm, ym);
    }
  } else {
    if (y != ym) {
      if (Math.abs(ym - y) <= actionPoints) {
        API.move(xm, ym);
      } else {
        ym = Math.sign(ym - y) * actionPoints;
        API.move(xm, ym);
      }
    } else {
      if (xm == 8) {
        API.move(7,ym);
      } else {
        API.move(1, ym);
      }
    }
  }
} else {
  let { mX, mY } = getNearEnemy(enemies, actionPoints);
  API.move(mX, mY);
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
    if (enemy.distance < actionPoints) {
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
