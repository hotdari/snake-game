# snake-game
javascript snake game

# 클래스
## GameOption
- 게임내에 옵션은 GameOption 클래스에서 가져옴.
- 옵션은 여러개가 되지 않게 싱글톤으로 가져오게 설정.
- 설정기능은 아직 구현하지 않음.
```javascript
// 게임 옵션 클래스
class GameOption {
  static instance;

  constructor(){
    this.option = {
      width: 20, // 맵의 cell-width
      height: 20, // 맵의 cell-height
      target: document.getElementById("game"), // 맵생성 타겟(table)
      speed: 100, // 게임 속도
      appleSpeed: 5000, // 사과 생성 속도
      snakeColor: "#000000", // 뱀 색깔
      appleColor: "red", // 사과 색깔
      mapColor: "#ffffff" // 맵 색상
    }
  }

  static GetInstance(){
    if(!GameOption.instance) GameOption.instance = new GameOption();
    return GameOption.instance;
  }
}
```

## Map
- 게임옵션 클래스에서 가져온 옵션을 기반으로 맵을 생성
- 생성자를 선언하는 동시에 맵이 생성
- 맵은 target(table) element에 테이블 요소들로 생성됩니다.
```javascript
// 맵 클래스
class Map {
  constructor(){
    this.target = GameOption.GetInstance().option.target,
    this.width = GameOption.GetInstance().option.width,
    this.height = GameOption.GetInstance().option.height,
    this.create()
  }

  // 맵생성
  create(){
    for (let i = 0; i < this.height; i++) {
      const row = document.createElement("tr");
        for (let j = 0; j < this.height; j++) {
          const cell = document.createElement("td");
          cell.style.backgroundColor = GameOption.GetInstance().option.mapColor;
          cell.style.width = this.width + 'px';
          cell.style.height = this.height + 'px';
          cell.id = `cell-${i}-${j}`;
          row.appendChild(cell);
        }
      this.target.appendChild(row);
    }
  }
}
```

## Snake
- 뱀 클래스는 좌표를 받아서 생성
- 먹기 기능은 사과만 먹습니다. 게임 클래스에서 사과가 아닐경우 게임을 끝내게 구현
- 사과를 먹으면 snake 배열에 사과의 좌표가 추가됩니다.
```javascript
// 뱀 클래스
class Snake {
  constructor(x, y){
    this.snake = [{x, y}],
    this.direction = "right"
  }

  /**
   * 사과먹기
   * @param {*} apple
   */
  eat(apple) {
    const {x, y} = apple;
    this.snake.push({x, y})
  }
}
```

## Apple
- 맵 크기만큼만 사과 위치가 랜덤하게 생성되게하였습니다.
- 먹히는 존재여서 다른 기능은 없음
```javascript
// 사과 클래스
class Apple {
  constructor() {
    this.x = Math.floor(Math.random() * GameOption.GetInstance().option.width);
    this.y = Math.floor(Math.random() * GameOption.GetInstance().option.height);
  }
}
```


## SnakeGame
- 모든 오브젝트들이 스네이크 게임 클래스에서 생성됩니다.
- draw() : 맵, 스네이크, 사과를 표시된 좌표기준으로 그려줍니다.
- update() : draw() 함수를 호출하여 화면이 업데이트될때마다 그립니다.
  뱀의 머리 방향이 바뀌면 좌표도 업데이트해줍니다. 전반적인 게임화면의 업데이트 역할을 맡습니다.
- start() : 게임을 시작하는 역할을 합니다. (인터벌 시작)
- end() : 게임 종료 역할 (인터벌 종료)
- match() : 오브젝트간에 좌표값을 기준으로 사과, 뱀인지 판단하여 동작하게 수행

```javascript
// 스네이크 게임 생성
class SnakeGame {
  static instance;

  constructor(){
    this.mapObj = new Map(), // 맵 생성
    this.snakeObj = new Snake(4,4); // 뱀 생성
    this.appleList = []; // 사괴리스트
    this.gameInterval = null; // 게임 인터벌
    this.appleInterval = null; // 사과 생성 인터벌
    this.moveController(); // 게임 키보드 이벤트 컨트롤
  }

  static GetInstance(){
    if(!SnakeGame.instance) SnakeGame.instance = new SnakeGame();
    return SnakeGame.instance;
  }

  // 게임 그래픽 그리는 기능
  draw(){
    // 맵색상 초기화
    for (let i = 0; i < this.mapObj.width; i++) {
      for (let j = 0; j < this.mapObj.height; j++) {
        document.getElementById(`cell-${i}-${j}`).style.backgroundColor = GameOption.GetInstance().option.mapColor;
      }
    }
    
    // 스네이트 그리기
    for (const cell of this.snakeObj.snake) {
      document.getElementById(`cell-${cell.y}-${cell.x}`).style.backgroundColor = GameOption.GetInstance().option.snakeColor;
    }

    // 사과 그리기
    for (const cell of this.appleList) {
      document.getElementById(`cell-${cell.y}-${cell.x}`).style.backgroundColor = GameOption.GetInstance().option.appleColor;
    }
  }

  // 게임화면 업데이트
  update() {
    let direction = this.snakeObj.direction;
    let x = this.snakeObj.snake[0].x;
    let y = this.snakeObj.snake[0].y;

    if (direction === "right") x++;
    if (direction === "left") x--;
    if (direction === "up") y--;
    if (direction === "down") y++;

    this.snakeObj.snake.pop();
    this.snakeObj.snake.unshift({ x, y });

    try {
      this.match();
      this.draw();
    } catch (error) {
      console.error(error)
      this.end();
    }
  }

  // 게임 스타트 사이클
  start(){
    this.gameInterval = setInterval(() => {
      this.update()
    }, GameOption.GetInstance().option.speed)

    this.appleInterval = setInterval(() => {
      const apple = new Apple();
      this.appleList.push(apple)
    }, GameOption.GetInstance().option.appleSpeed)
  }


  // 게임 엔드 사이클 
  end(){
    alert("Game Over");
    clearInterval(this.gameInterval)
    clearInterval(this.appleInterval)
  }

  // 오브젝트간에 매칭
  match(){
      // 사과를 물은 여부
      const isBiteApple = (obj) => {
        if(obj.x === this.snakeObj.snake[0].x && obj.y === this.snakeObj.snake[0].y) return true;
        return false;
      }
      
      // 뱀을 물은 여부
      const isBiteSnake = (obj) => {
        if(obj.x === this.snakeObj.snake[0].x && obj.y === this.snakeObj.snake[0].y) return true;
        return false;
      }
      
      // 사과를 물은 좌표찾아서 제거
      const bitedApple = this.appleList.find(isBiteApple);
      this.appleList = this.appleList.filter(
        apple => apple !== bitedApple
      );
      
      // 뱀의 몸만 따로 배열로 모으기
      const snakeBody = this.snakeObj.snake.filter((snakeItem, index) => {
        return index > 0
      })
      
      // 뱀이 문게 자기 몸인지 판단
      const biteSnake = snakeBody.find(isBiteSnake)
      
      // 사과를 물었다면 뱀이 먹는다.
      if(bitedApple) this.snakeObj.eat(bitedApple)

      // 뱀이 자기자신을 물었으면 게임을 끝낸다.
      if(biteSnake) this.end();
  }

  // 키보드입력 컨트롤러
  moveController(){
    window.addEventListener("keydown", event => {
      switch (event.code) {
        case "ArrowRight":
          if(this.snakeObj.direction === "left") break;
          this.snakeObj.direction = "right";
          break;
        case "ArrowLeft":
          if(this.snakeObj.direction === "right") break;
          this.snakeObj.direction = "left";
          break;
        case "ArrowUp":
          if(this.snakeObj.direction === "down") break;
          this.snakeObj.direction = "up";
          break;
        case "ArrowDown":
          if(this.snakeObj.direction === "up") break;
          this.snakeObj.direction = "down";
          break;
      }
    });
  }
}
```