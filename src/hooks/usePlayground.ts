import * as PIXI from "pixi.js";

/** @description 单个元素 */
export const useDemoA = async (app: PIXI.Application) => {
  const texture = await PIXI.Assets.load("https://pixijs.com/assets/bunny.png");

  const bunny = new PIXI.Sprite(texture);

  bunny.anchor.set(0.5);
  bunny.scale.set(3);

  bunny.x = app.screen.width / 2;
  bunny.y = app.screen.height / 2;

  app.stage.addChild(bunny);
  app.ticker.add((time) => {
    bunny.rotation += time.deltaTime * 0.01;
  });
};

/** @description 将多个元素使用容器装载 */
export const useDemoB = async (app: PIXI.Application) => {
  const container = new PIXI.Container();

  const texture = await PIXI.Assets.load("https://pixijs.com/assets/bunny.png");

  for (let i = 0; i < 25; i++) {
    const bunny = new PIXI.Sprite(texture);

    bunny.x = (i % 5) * 26;
    bunny.y = Math.floor(i / 5) * 37;
    container.addChild(bunny);
  }

  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;

  container.pivot.x = container.width / 2;
  container.pivot.y = container.height / 2;

  app.ticker.add((time) => {
    container.rotation -= 0.01 * time.deltaTime;
  });

  app.stage.addChild(container);
};

/** @description 将多个元素使用容器装载 */
export const useDemo = async (app: PIXI.Application) => {
  const texture = await PIXI.Assets.load("https://pixijs.com/assets/bunny.png");
  const sprite1 = new PIXI.Sprite(texture);
  const sprite2 = new PIXI.Sprite(texture);
  sprite2.x = 100;
  const rect1 = sprite1.getBounds();
  const rect2 = sprite2.getBounds();

  function isColliding(rect1: PIXI.Rectangle, rect2: PIXI.Rectangle): boolean {
    return (
      rect1.x + rect1.width > rect2.x &&
      rect1.x < rect2.x + rect2.width &&
      rect1.y + rect1.height > rect2.y &&
      rect1.y < rect2.y + rect2.height
    );
  }

  if (isColliding(rect1, rect2)) {
    console.log("Collision detected!");
  } else {
    console.log("No Collision detected!");
  }

  app.stage.addChild(sprite1, sprite2);
};
