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
// 定义一个接口 Reel，表示一个转轴
interface Reel {
  container: PIXI.Container; // 转轴的容器
  symbols: PIXI.Sprite[]; // 转轴上的符号
  position: number; // 当前转轴位置
  previousPosition: number; // 上一个转轴位置
  blur: PIXI.BlurFilter; // 模糊滤镜
}

// 导出异步函数 useDemo
export const useDemo = async (app: PIXI.Application) => {
  // 加载纹理资源
  await PIXI.Assets.load([
    "https://pixijs.com/assets/eggHead.png",
    "https://pixijs.com/assets/flowerTop.png",
    "https://pixijs.com/assets/helmlok.png",
    "https://pixijs.com/assets/skully.png",
  ]);

  const REEL_WIDTH = 160; // 定义转轴宽度
  const SYMBOL_SIZE = 150; // 定义符号大小

  // 创建纹理数组
  const slotTextures = [
    PIXI.Texture.from("https://pixijs.com/assets/eggHead.png"),
    PIXI.Texture.from("https://pixijs.com/assets/flowerTop.png"),
    PIXI.Texture.from("https://pixijs.com/assets/helmlok.png"),
    PIXI.Texture.from("https://pixijs.com/assets/skully.png"),
  ];

  const reels: Reel[] = []; // 创建转轴数组
  const reelContainer = new PIXI.Container(); // 创建转轴容器

  // 创建5个转轴
  for (let i = 0; i < 5; i++) {
    const rc = new PIXI.Container(); // 创建单个转轴容器

    rc.x = i * REEL_WIDTH; // 设置转轴容器的x坐标
    reelContainer.addChild(rc); // 将转轴容器添加到主容器

    const reel: Reel = {
      container: rc, // 绑定转轴容器
      symbols: [], // 初始化符号数组
      position: 0, // 初始化位置
      previousPosition: 0, // 初始化上一个位置
      blur: new PIXI.BlurFilter(), // 创建模糊滤镜
    };

    reel.blur.blurX = 0; // 设置模糊滤镜x轴模糊度
    reel.blur.blurY = 0; // 设置模糊滤镜y轴模糊度
    rc.filters = [reel.blur]; // 应用模糊滤镜

    // 在每个转轴上创建4个符号
    for (let j = 0; j < 4; j++) {
      const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]); // 随机选择一个纹理创建符号

      symbol.y = j * SYMBOL_SIZE; // 设置符号的y坐标
      symbol.scale.x = symbol.scale.y = Math.min(
        SYMBOL_SIZE / symbol.width,
        SYMBOL_SIZE / symbol.height,
      ); // 设置符号缩放比例
      symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2); // 设置符号的x坐标
      reel.symbols.push(symbol); // 将符号添加到符号数组
      rc.addChild(symbol); // 将符号添加到转轴容器
    }
    reels.push(reel); // 将转轴添加到转轴数组
  }
  app.stage.addChild(reelContainer); // 将转轴容器添加到舞台

  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2; // 计算边距

  reelContainer.y = margin; // 设置转轴容器的y坐标
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5); // 设置转轴容器的x坐标
  const top = new PIXI.Graphics().rect(0, 0, app.screen.width, margin).fill({ color: 0x0 }); // 创建顶部遮罩
  const bottom = new PIXI.Graphics()
    .rect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin)
    .fill({ color: 0x0 }); // 创建底部遮罩

  const fill = new PIXI.FillGradient(0, 0, 0, 36 * 1.7); // 创建渐变填充

  const colors = [0xffffff, 0x00ff99].map((color) => PIXI.Color.shared.setValue(color).toNumber()); // 设置渐变颜色

  colors.forEach((number, index) => {
    const ratio = index / colors.length; // 计算颜色比率

    fill.addColorStop(ratio, number); // 添加颜色到渐变填充
  });

  const style: PIXI.TextStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fontStyle: "italic",
    fontWeight: "bold",
    fill: { fill }, // 设置文字填充样式
    stroke: { color: 0x4a1850, width: 5 }, // 设置文字描边样式
    dropShadow: {
      color: 0x000000,
      angle: Math.PI / 6,
      blur: 4,
      distance: 6,
    },
    wordWrap: true, // 启用自动换行
    wordWrapWidth: 440, // 设置换行宽度
  });

  const playText = new PIXI.Text("Spin the wheels!", style); // 创建"Spin the wheels!"文本

  playText.x = Math.round((bottom.width - playText.width) / 2); // 设置文本x坐标
  playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2); // 设置文本y坐标
  bottom.addChild(playText); // 将文本添加到底部遮罩

  const headerText = new PIXI.Text({
    style,
    text: "PIXI MONSTER SLOTS!",
  }); // 创建"PIXI MONSTER SLOTS!"文本

  headerText.x = Math.round((top.width - headerText.width) / 2); // 设置文本x坐标
  headerText.y = Math.round((margin - headerText.height) / 2); // 设置文本y坐标
  top.addChild(headerText); // 将文本添加到顶部遮罩

  app.stage.addChild(top); // 将顶部遮罩添加到舞台
  app.stage.addChild(bottom); // 将底部遮罩添加到舞台

  bottom.eventMode = "static"; // 设置底部遮罩事件模式
  bottom.cursor = "pointer"; // 设置鼠标指针样式
  bottom.addListener("pointerdown", () => {
    startPlay(); // 添加点击事件监听器，调用 startPlay 函数
  });

  let running = false; // 定义运行状态

  function startPlay() {
    if (running) return; // 如果正在运行则返回
    running = true; // 设置运行状态为 true

    // 循环遍历每个转轴
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i]; // 获取当前转轴
      const extra = Math.floor(Math.random() * 3); // 随机生成额外的位移
      const target = r.position + 10 + i * 5 + extra; // 计算目标位置
      const time = 2500 + i * 600 + extra * 600; // 计算动画时间

      tweenTo(
        r,
        "position",
        target,
        time,
        backout(0.5),
        null,
        i === reels.length - 1 ? reelsComplete : null,
      ); // 调用 tweenTo 函数执行动画
    }
  }

  function reelsComplete() {
    running = false; // 设置运行状态为 false
  }

  app.ticker.add(() => {
    // 每帧更新转轴状态
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i]; // 获取当前转轴

      r.blur.blurX = (r.position - r.previousPosition) * 8; // 根据转轴位置更新模糊滤镜
      r.blur.blurY = (r.position - r.previousPosition) * 8; // 根据转轴位置更新模糊滤镜
      r.previousPosition = r.position; // 更新上一个位置

      // 更新转轴上符号的位置
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevy = s.y;

        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
          s.scale.x = s.scale.y = Math.min(
            SYMBOL_SIZE / s.texture.width,
            SYMBOL_SIZE / s.texture.height,
          );
          s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
        }
      }
    }
  });

  // 定义一个接口 Tweening，表示一个补间动画
  interface Tweening {
    object: Reel; // 动画对象
    property: string; // 动画属性
    propertyBeginValue: any; // 属性初始值
    target: number; // 目标值
    easing: (t: number) => number; // 缓动函数
    time: number; // 动画时间
    change: null | ((Tweening: Tweening) => void); // 动画过程中回调函数
    complete: null | ((Tweening: Tweening) => void); // 动画完成回调函数
    start: number; // 动画开始时间
  }

  const tweening: Tweening[] = []; // 创建补间动画数组
  function tweenTo(
    object: Reel,
    property: keyof Reel,
    target: number,
    time: number,
    easing: (t: number) => number,
    onchange: null | (() => void),
    oncomplete: null | (() => void),
  ) {
    const tween = {
      object,
      property,
      propertyBeginValue: object[property], // 获取属性初始值
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(), // 获取当前时间
    };
    tweening.push(tween); // 将补间动画添加到数组

    return tween;
  }
  app.ticker.add(() => {
    const now = Date.now(); // 获取当前时间
    const remove = [];

    // 循环遍历每个补间动画
    for (let i = 0; i < tweening.length; i++) {
      const t = tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time); // 计算动画进度

      const property = t.property as keyof Reel;
      t.object[property] = lerp(t.propertyBeginValue, t.target, t.easing(phase)) as any; // 更新动画属性

      if (t.change) t.change(t); // 调用动画过程中回调函数
      if (phase === 1) {
        t.object[property] = t.target as any; // 设置属性为目标值
        if (t.complete) t.complete(t); // 调用动画完成回调函数
        remove.push(t); // 将动画添加到删除数组
      }
    }
    for (let i = 0; i < remove.length; i++) {
      tweening.splice(tweening.indexOf(remove[i]), 1); // 从补间动画数组中删除已完成的动画
    }
  });

  // 线性插值函数
  function lerp(a1: number, a2: number, t: number) {
    return a1 * (1 - t) + a2 * t;
  }

  // 缓动函数
  function backout(amount: number) {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
  }
};
