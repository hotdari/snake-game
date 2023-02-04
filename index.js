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

// 사과 클래스
class Apple {
  constructor() {
    this.x = Math.floor(Math.random() * GameOption.GetInstance().option.width);
    this.y = Math.floor(Math.random() * GameOption.GetInstance().option.height);
  }
}

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


// main js
function main(){
  const game = SnakeGame.GetInstance();
  game.start()
}

main();
