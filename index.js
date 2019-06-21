let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas';
}

// Aliases
const {
  Application,
  loader,
  loader: { resources },
  Sprite
} = PIXI;

const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 800;

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
    //images loading
    'assets\\img\\slotOverlay.png',
    'assets\\img\\winningFrameBackground.jpg',
    'assets\\img\\btn_spin_pressed.png',
    'assets\\img\\btn_spin_normal.png',
    'assets\\img\\btn_spin_hover.png',
    'assets\\img\\btn_spin_disable.png',
    // symbols loading
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

  // Build the reels
  const reels = [];
  const reelContainer = new PIXI.Container();
  for (let i = 0; i < 5; i++) {
    const rc = new PIXI.Container();
    rc.x = i * REEL_WIDTH;
    reelContainer.addChild(rc);

    const reel = {
      container: rc,
      symbols: [],
      position: 0,
      previousPosition: 0,
      blur: new PIXI.filters.BlurFilter()
    };
    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    rc.filters = [reel.blur];

    // Build the symbols
    for (let j = 0; j < 4; j++) {
      const symbol = new PIXI.Sprite(
        symbolsTextures[Math.floor(Math.random() * symbolsTextures.length)]
      );
      // Scale the symbol to fit symbol area.
      symbol.y = j * SYMBOL_SIZE;
      symbol.scale.x = symbol.scale.y = Math.min(
        SYMBOL_SIZE / symbol.width,
        SYMBOL_SIZE / symbol.height
      );
      symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }
    reels.push(reel);
  }
  app.stage.addChild(reelContainer);

  //Start the game loop
  // app.ticker.add(delta => gameLoop(delta));

  // function gameLoop(delta) {
  //   tenSymbol.y += 1 + delta;
  // }
}
