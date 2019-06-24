let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas';
}

const randomSprite = texturesArr => {
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

// const REEL_WIDTH = SCREEN_WIDTH / 5;
// const SYMBOL_HEIGHT = SCREEN_HEIGHT / 3;

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

//Create a Pixi Application
const app = new Application({ width: SCREEN_HEIGHT, height: SCREEN_HEIGHT });

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
  background.width = 1200;
  background.height = 800;
  app.stage.addChild(background);

  const overlay = new Sprite(resources['assets\\img\\slotOverlay.png'].texture);
  overlay.width = 1200;
  overlay.height = 800;
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

  const reelContainer = new Container();

  const reel = {
    symbols: []
  };
  
  // Populate reel by symbols
  [...new Array(VISIBLE_SYMBOLS)].forEach((_, index) => {
    const symbol = randomSprite(symbolsTextures);
    symbol.y = index * SYMBOL_SIZE;
    reel.symbols.push(symbol);
    reelContainer.addChild(symbol);
  });

  app.stage.addChild(reelContainer);

  app.ticker.add(delta => {
    console.log(reel.symbols)
    reel.symbols.forEach((symbol, index) => {
      console.log(symbol.y)
      symbol.y += 5;
      if (symbol.y > 1200) {
        const newSymbol = randomSprite(symbolsTextures);
        newSymbol.y = -100;
        reelContainer.addChild(newSymbol);
        // reelContainer.removeChild(symbol);
        reel.symbols.unshift(newSymbol);
        reel.symbols.pop();
      }
    });
  });
}
