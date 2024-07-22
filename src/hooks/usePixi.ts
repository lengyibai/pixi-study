import * as PIXI from "pixi.js";
import {
  AnimatedSprite,
  Assets,
  Color,
  Container,
  FillGradient,
  Graphics,
  GraphicsContext,
  MeshPlane,
  Rectangle,
  Sprite,
  Spritesheet,
  Text,
  TextStyle,
  Texture,
  type Application,
} from "pixi.js";

export const useA = async (app: Application) => {
  const createBlock = (color: string, text: string) => {
    const container = new PIXI.Container();
    const graphics = new PIXI.Graphics();
    graphics.rect(0, 0, 100, 100);
    graphics.fill(color);
    container.addChild(graphics);

    const style = new PIXI.TextStyle({
      fill: "#ffffff",
      fontSize: 10,
      fontWeight: "bold",
    });
    const message = new PIXI.Text({
      text,
      style,
    });
    message.anchor.set(0.5);
    message.position.set(50, 50);
    container.addChild(message);

    return container;
  };

  const left = createBlock("#c0392b", "Left");
  const center = createBlock("#d35400", "Center");
  const right = createBlock("#f39c12", "Right");
  const top = createBlock("#27ae60", "Top");
  const bottom = createBlock("#2980b9", "Bottom");

  app.stage.addChild(left);
  app.stage.addChild(center);
  app.stage.addChild(right);
  app.stage.addChild(top);
  app.stage.addChild(bottom);

  const resize = () => {
    const { width, height } = app.renderer;

    left.width = width * 0.2;
    left.height = height * 0.8;
    left.position.set(0, height * 0.1);

    right.width = width * 0.2;
    right.height = height * 0.8;
    right.position.set(width * 0.8, height * 0.1);

    center.width = width * 0.6;
    center.height = height * 0.8;
    center.position.set(width * 0.2, height * 0.1);

    top.width = width;
    top.height = height * 0.1;
    top.position.set(0, 0);

    bottom.width = width;
    bottom.height = height * 0.1;
    bottom.position.set(0, height * 0.9);
  };

  resize();
  window.addEventListener("resize", resize);
};

/** @description 层级关系 */
export const useC = async (app: PIXI.Application) => {
  const label = new PIXI.Text({
    text: "Scene Graph:\n\napp.stage\n  ┗ A\n     ┗ B\n     ┗ C\n  ┗ D",
    style: { fill: "#ffffff" },
    position: { x: 300, y: 100 },
  });

  app.stage.addChild(label);

  //用字母创建颜色块的辅助功能
  const letters: PIXI.Container[] = [];
  function addLetter(
    letter: string,
    parent: any,
    color: number,
    position: { x: number; y: number },
  ) {
    const sprite = new PIXI.Sprite({
      texture: PIXI.Texture.WHITE,
      width: 100,
      height: 100,
      tint: color,
    });

    const text = new PIXI.Text({
      text: letter,
      anchor: { x: 0.5, y: 0.5 },
      position: { x: 50, y: 50 },
      style: new PIXI.TextStyle({
        fontSize: 36,
        fill: "white",
      }),
    });

    const container = new PIXI.Container();
    container.position = position;
    container.visible = false;

    container.addChild(sprite, text);
    parent.addChild(container);
    letters.push(container);
    return container;
  }

  const a = addLetter("A", app.stage, 0xff0000, { x: 0, y: 0 });
  addLetter("B", app.stage, 0x00ff00, { x: 10, y: 10 });
  addLetter("C", app.stage, 0x0000ff, { x: 20, y: 20 });
  addLetter("D", app.stage, 0xff8800, { x: 30, y: 30 });

  // 显示容器
  let elapsed = 0.0;
  app.ticker.add((ticker) => {
    elapsed += ticker.deltaTime / 60;

    if (elapsed >= letters.length) {
      // elapsed = 0.0;
    }
    if (elapsed >= 2) {
      //设置精灵位置，也相当于设置层级关系
      app.stage.setChildIndex(letters[0], 4);
    }
    for (let i = 0; i < letters.length; i++) {
      letters[i].visible = elapsed >= i;
    }
  });
  setTimeout(() => {
    app.stage.position.set(100, 100);
    //将第一元素关闭渲染，关闭渲染会隐藏元素，比如那些移除屏幕或被遮挡的元素
    letters[0].renderable = false;
    //获取相对cnavas的位置
    const globalPos = letters[0].getGlobalPosition();
    //获取相对stage的位置
    const localPos = letters[0].getGlobalPosition();
    console.log(letters[0].position, globalPos);

    setTimeout(() => {
      letters[0].renderable = true;
    }, 1000);
  }, 3000);
};

/** @description 使用场景组 */
export const useD = async (app: PIXI.Application) => {
  // 创建自定义根容器
  const customStage = new PIXI.Container({
    // this will make moving this container GPU powered
    isRenderGroup: true,
  });

  // 异步加载图像资源
  const treeTexture = await PIXI.Assets.load("/public/img/diamond.png");

  // 创建子容器
  const myGameWorld = new PIXI.Container();
  const myHud = new PIXI.Container();

  const sprite1 = new PIXI.Sprite({
    texture: treeTexture,
  });
  const sprite2 = new PIXI.Sprite({
    texture: treeTexture,
  });

  // 添加精灵
  myGameWorld.addChild(sprite1);
  myHud.addChild(sprite2);

  // 将子容器添加到自定义根容器中
  customStage.addChild(myGameWorld, myHud);
  app.stage.addChild(customStage);

  app.start();
};

/** @description 使用资源 */
export const useE = async (app: PIXI.Application) => {
  // 异步加载图像资源
  const treeTexture = await PIXI.Assets.load({
    src: "/public/img/diamond.png",
  });

  // 创建精灵
  const sprite = PIXI.Sprite.from(treeTexture);
  sprite.x = app.screen.width / 2;
  sprite.y = app.screen.height / 2;
  sprite.anchor.set(0.5, 0.5);
  app.stage.addChild(sprite);
};
