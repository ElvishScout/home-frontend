// @ts-check

/**
 * remark 插件：把所有 markdown 图片节点换成 <ImageViewer> 组件节点，
 * 并把其中的相对路径在编译期展开成 static import。
 *
 * 图片和文章放在一起（articles/ 下），不在 public/，浏览器按页面 URL 解析
 * `./graph.png` 只会得到 404。这里把 `![alt](./graph.png)` 换成
 *
 *   import _mdxImage0 from "./graph.png";
 *   <ImageViewer src={_mdxImage0.src ?? _mdxImage0} width={…} height={…} alt="alt" />
 *
 * import 路径相对**文章文件本身**解析，所以不需要任何前缀换算；带上的
 * width / height 来自打包器给出的 StaticImageData，既能让图片占住等比空间，
 * 也是后续 ImageViewer 做全屏缩放要用的数据。
 *
 * 站点绝对路径（/grain.svg）与外链原样作为字符串传给组件——不走 import，
 * 但仍然换成 <ImageViewer>，这样一篇文章里的图片渲染路径只有一条。
 *
 * 与 remark-mermaid.mjs 同款做法：产出组件节点而非 html 字符串，组件本体在
 * mdx-components.tsx 注册。必须挂在 remarkPlugins（mdast 阶段）：import 与
 * JSX 属性表达式都靠节点上的 data.estree 生效，remark-rehype 之后管线里
 * 已经没有「模块级 import」了。
 *
 * 注意：作者手写的 <img> 编译成字面量 "img"，本插件看不到（它只认 markdown
 * 图片节点），正文里一律用 markdown 图片语法。
 */
export default function remarkMdxImage() {
  return (/** @type {any} */ tree) => {
    /** import 路径 → 局部变量名；同一张图出现多次只产出一条 import。 */
    /** @type {Map<string, string>} */
    const imports = new Map();

    /**
     * @param {any} node
     * @returns {any}
     */
    function makeImage(node) {
      /** @type {any[]} */
      const attributes = [];
      const specifier = importSpecifier(node.url);

      if (specifier) {
        let local = imports.get(specifier);
        if (!local) {
          // 计数器取自 Map 大小，保证每个文件都从 _mdxImage0 重新开始
          local = `_mdxImage${imports.size}`;
          imports.set(specifier, local);
        }

        attributes.push(
          // ?? 兜底：图片默认编译成 StaticImageData，少数资源类型可能直接给字符串
          expressionAttribute("src", {
            type: "LogicalExpression",
            operator: "??",
            left: member(local, "src"),
            right: identifier(local),
          }),
          expressionAttribute("width", member(local, "width")),
          expressionAttribute("height", member(local, "height")),
        );
      } else {
        // 绝对路径与外链拿不到尺寸，交给浏览器
        attributes.push({ type: "mdxJsxAttribute", name: "src", value: node.url });
      }

      attributes.push({ type: "mdxJsxAttribute", name: "alt", value: node.alt ?? "" });

      return {
        type: "mdxJsxTextElement",
        name: "ImageViewer",
        attributes,
        children: [],
      };
    }

    /**
     * @param {any} node
     * @returns {any}
     */
    function transform(node) {
      if (Array.isArray(node.children)) {
        node.children = node.children.map((/** @type {any} */ child) =>
          child.type === "image" ? makeImage(child) : transform(child),
        );
      }
      return node;
    }

    transform(tree);

    if (imports.size > 0) {
      const esm = [...imports].map(([specifier, local]) => makeImport(local, specifier));
      tree.children.unshift(...esm);
    }
  };
}

/** 站点绝对路径、协议相对地址、带 scheme 的 URL（https:、data:…）都不参与改写。 */
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/)/i;

/**
 * 把 markdown 里的图片地址换算成 import 路径；不需要走 import 的返回 null。
 *
 * @param {string} url
 * @returns {string | null}
 */
function importSpecifier(url) {
  if (!url || EXTERNAL.test(url)) return null;

  let path = url;
  try {
    // micromark 会把 dest 里的空格、花括号等百分号编码
    path = decodeURIComponent(path);
  } catch {
    // 裸 % 之类解不开的，保持原样
  }

  // 查询串与锚点对内容哈希后的产物没有意义
  [path] = path.split(/[?#]/);
  if (!path) return null;

  // 裸文件名会被当成包名解析，补上 ./ 前缀
  return path.startsWith(".") ? path : `./${path}`;
}

/**
 * @param {string} name
 * @returns {any}
 */
function identifier(name) {
  return { type: "Identifier", name };
}

/**
 * estree 的成员表达式：`object.property`
 *
 * @param {string} object
 * @param {string} property
 * @returns {any}
 */
function member(object, property) {
  return {
    type: "MemberExpression",
    object: identifier(object),
    property: identifier(property),
    computed: false,
    optional: false,
  };
}

/**
 * 表达式属性：`name={expression}`。
 * data.estree 是唯一事实来源，value 只是便于阅读的源码示意。
 *
 * @param {string} name
 * @param {any} expression
 * @returns {any}
 */
function expressionAttribute(name, expression) {
  let value = "…";
  if (expression.type === "LogicalExpression") {
    value = `${expression.left.object.name}.src ?? ${expression.left.object.name}`;
  } else if (expression.type === "MemberExpression") {
    value = `${expression.object.name}.${expression.property.name}`;
  }

  return {
    type: "mdxJsxAttribute",
    name,
    value: {
      type: "mdxJsxAttributeValueExpression",
      value,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [{ type: "ExpressionStatement", expression }],
        },
      },
    },
  };
}

/**
 * 默认导入声明节点。
 *
 * @param {string} local  局部变量名
 * @param {string} specifier  import 路径
 * @returns {any}
 */
function makeImport(local, specifier) {
  const raw = JSON.stringify(specifier);
  return {
    type: "mdxjsEsm",
    value: `import ${local} from ${raw}`,
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        body: [
          {
            type: "ImportDeclaration",
            specifiers: [{ type: "ImportDefaultSpecifier", local: identifier(local) }],
            source: { type: "Literal", value: specifier, raw },
          },
        ],
      },
    },
  };
}
