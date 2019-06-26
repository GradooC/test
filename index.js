let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas';
}

const getRandomSprite = () => {
  const symbolsTextures = [
    resources['assets\\img\\symbols\\01.png'].texture,
    resources['assets\\img\\symbols\\02.png'].texture,
    resources['assets\\img\\symbols\\03.png'].texture,
    resources['assets\\img\\symbols\\04.png'].texture,
    resources['assets\\img\\symbols\\05.png'].texture,
    resources['assets\\img\\symbols\\06.png'].texture,
    resources['assets\\img\\symbols\\07.png'].texture,
    resources['assets\\img\\symbols\\08.png'].texture,
    resources['assets\\img\\symbols\\09.png'].texture,
    resources['assets\\img\\symbols\\10.png'].texture,
    resources['assets\\img\\symbols\\11.png'].texture,
    resources['assets\\img\\symbols\\12.png'].texture,
    resources['assets\\img\\symbols\\13.png'].texture
  ];
  const textureIndex = Math.floor(Math.random() * symbolsTextures.length);
  return new Sprite(symbolsTextures[textureIndex]);
};

// Aliases
const {
  Application,
  loader,
  loader: { resources },
  Sprite,
  Container
} = PIXI;

const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 800;
const BTN_SIZE = 150;
const REELS_AMOUNT = 5;
const VISIBLE_SYMBOLS = 6;
const MARGIN_VERTICAL = 50;
const MARGIN_HORIZONTAL = 50;
const REEL_WIDTH = (SCREEN_WIDTH - MARGIN_HORIZONTAL * 2) / REELS_AMOUNT;
const SYMBOL_SIZE = (SCREEN_HEIGHT - MARGIN_VERTICAL * 2) / (VISIBLE_SYMBOLS - 2);
const SPEED_BASE = 10;
const allReels = [];
let activeReels = [];
let called = false;
let state;
let startTime;

//Create a Pixi Application
const app = new Application({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

loader
  .add([
    // Images loading
    'assets\\img\\slotOverlay.png',
    'assets\\img\\winningFrameBackground.jpg',
    'assets\\img\\btn_spin_pressed.png',
    'assets\\img\\btn_spin_normal.png',
    'assets\\img\\btn_spin_hover.png',
    'assets\\img\\btn_spin_disable.png',
    // Symbols loading
    'assets\\img\\symbols\\01.png',
    'assets\\img\\symbols\\02.png',
    'assets\\img\\symbols\\03.png',
    'assets\\img\\symbols\\04.png',
    'assets\\img\\symbols\\05.png',
    'assets\\img\\symbols\\06.png',
    'assets\\img\\symbols\\07.png',
    'assets\\img\\symbols\\08.png',
    'assets\\img\\symbols\\09.png',
    'assets\\img\\symbols\\10.png',
    'assets\\img\\symbols\\11.png',
    'assets\\img\\symbols\\12.png',
    'assets\\img\\symbols\\13.png'
  ])
  .load(setup);

function setup() {
  //Background setup
  const background = new Sprite(resources['assets\\img\\winningFrameBackground.jpg'].texture);
  background.width = SCREEN_WIDTH;
  background.height = SCREEN_HEIGHT;
  app.stage.addChild(background);

  // OverLay setup
  const overlay = new Sprite(resources['assets\\img\\slotOverlay.png'].texture);
  overlay.width = SCREEN_WIDTH;
  overlay.height = SCREEN_HEIGHT;
  app.stage.addChild(overlay);

  // Play button setup
  const button = new Sprite(resources['assets\\img\\btn_spin_normal.png'].texture);
  button.interactive = true;
  button.width = BTN_SIZE;
  button.height = BTN_SIZE;
  button.position.set(SCREEN_WIDTH - BTN_SIZE, SCREEN_HEIGHT - BTN_SIZE);
  button.addListener('pointerdown', () => {
    activeReels = [...allReels];
  });
  app.stage.addChild(button);

  // Create reels
  [...new Array(REELS_AMOUNT)].forEach((_, reelIndex) => {
    const reelContainer = new Container();
    reelContainer.y = MARGIN_VERTICAL;
    reelContainer.x = MARGIN_HORIZONTAL + REEL_WIDTH * reelIndex;

    const reel = {
      container: reelContainer,
      symbols: []
    };
    allReels.push(reel);

    // Populate reels by symbols
    [...new Array(VISIBLE_SYMBOLS)].forEach((_, symbolIndex) => {
      const symbol = getRandomSprite();
      symbol.y = symbolIndex * SYMBOL_SIZE - SYMBOL_SIZE;
      reel.symbols.push(symbol);
      reelContainer.addChild(symbol);
    });

    app.stage.addChild(reelContainer);
  });
}

// Play function
const play = delta => {
  // Stopping reels
  // activeReels = [...allReels];
  activeReels.forEach((reel, reelIndex) => {
    setTimeout(() => {
      const removedReel = activeReels.shift();

      // Tweening symbols to specific position
      removedReel.symbols.forEach((symbol, symbolIndex) => {
        createjs.Tween.get(symbol).to(
          { y: SYMBOL_SIZE * symbolIndex - SYMBOL_SIZE },
          1000,
          createjs.Ease.getBackOut(5)
        );
      });
    }, 1000 + 1000 * reelIndex);
  });

  activeReels.forEach((reel, reelIndex) => {
    reel.symbols.forEach((symbol, symbolIndex) => {
      symbol.y += SPEED_BASE * (1 + reelIndex);
      // Delete old and add new symbols
      if (symbol.y > SYMBOL_SIZE * 5) {
        const newSymbol = getRandomSprite();
        newSymbol.y = -SYMBOL_SIZE;
        reel.container.addChild(newSymbol);
        reel.container.removeChild(symbol);
        // Update symbols array
        reel.symbols.unshift(newSymbol);
        reel.symbols.pop();
      }
    });
  });
};

// End function
// const end = () => {
//   if (called) return;
//   called = true;
//   // Tweening symbols to specific position
//   allReels.forEach(reel => {
//     reel.symbols.forEach((symbol, symbolIndex) => {
//       createjs.Tween.get(symbol).to({ y: SYMBOL_SIZE * symbolIndex - SYMBOL_SIZE }, 1000, createjs.Ease.getBackOut(5));
//       // .call(handleComplete);
//     });
//   });
// };

// const callOnce = fn => {
//   return () => {
//     let called = false;
//     return () => {
//       if (called) return;
//       called = true;
//       fn();
//     };
//   };
// };

// const callOnceEnd = callOnce(end);

state = play;

const gameLoop = delta => {
  // setTimeout(() => {
  //   console.log('!!!!!!');
  //   state = end;
  // }, 3000);

  state(delta);
};

startTime = new Date();

app.ticker.add(delta => gameLoop(delta));
