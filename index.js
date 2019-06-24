let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas';
}

const getRandomSprite = texturesArr => {
  const textureIndex = Math.floor(Math.random() * texturesArr.length);
  return new Sprite(texturesArr[textureIndex]);
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
const REELS_AMOUNT = 5;
const VISIBLE_SYMBOLS = 4;
const MARGIN_VERTICAL = 50;
const MARGIN_HORIZONTAL = 50;
const REEL_WIDTH = (SCREEN_WIDTH - MARGIN_HORIZONTAL * 2) / REELS_AMOUNT;
const SYMBOL_SIZE = (SCREEN_HEIGHT - MARGIN_VERTICAL * 2) / VISIBLE_SYMBOLS;
const SPEED_BASE = 5;
const allReels = [];

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
  const background = new Sprite(
    resources['assets\\img\\winningFrameBackground.jpg'].texture
  );
  background.width = SCREEN_WIDTH;
  background.height = SCREEN_HEIGHT;
  app.stage.addChild(background);

  const overlay = new Sprite(resources['assets\\img\\slotOverlay.png'].texture);
  overlay.width = SCREEN_WIDTH;
  overlay.height =  SCREEN_HEIGHT;
  app.stage.addChild(overlay);

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

    // Populate reel by symbols
    [...new Array(VISIBLE_SYMBOLS)].forEach((_, symbolIndex) => {
      const symbol = getRandomSprite(symbolsTextures);
      symbol.y = symbolIndex * SYMBOL_SIZE;
      reel.symbols.push(symbol);
      reelContainer.addChild(symbol);
    });

    app.stage.addChild(reelContainer);
  });

  app.ticker.add(delta => {
    allReels.forEach((reel, reelIndex) => {
      reel.symbols.forEach((symbol, symbolIndex) => {
        console.log(symbol.y);
        symbol.y += SPEED_BASE + SPEED_BASE * reelIndex;
        if (symbol.y >  SCREEN_HEIGHT) {
          const newSymbol = getRandomSprite(symbolsTextures);
          newSymbol.y = -SYMBOL_SIZE;
          reel.container.addChild(newSymbol);
          reel.container.removeChild(symbol);
          reel.symbols.unshift(newSymbol);
          reel.symbols.pop();
        }
      });
    });
  });
}
