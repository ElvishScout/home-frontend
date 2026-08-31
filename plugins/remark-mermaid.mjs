// @ts-check

/**
 * remark 插件：在 ```mermaid 代码块后面插入 <MermaidDiagram code={...}> 组件节点，
 * 原代码块保留（组件可自行决定如何展示源码），让图表在编译期成为 MDX 组件，
 * 而不是客户端再查 pre、动 DOM。
 * 组件本体在 mdx-components.tsx 注册（components/mermaid-diagram.tsx）。
 *
 * code 以表达式属性传入（字符串字面量的 estree），源码里的换行与花括号
 * 不经过 MDX 文本解析，不会被误当成 JSX 或表达式。
 */
export default function remarkMermaid() {
  /**
   * @param {any} codeNode
   * @returns {any}
   */
  function makeDiagram(codeNode) {
    const raw = JSON.stringify(codeNode.value);
    return {
      type: "mdxJsxFlowElement",
      name: "MermaidDiagram",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "code",
          value: {
            type: "mdxJsxAttributeValueExpression",
            value: raw,
            data: {
              estree: {
                type: "Program",
                sourceType: "module",
                body: [
                  {
                    type: "ExpressionStatement",
                    expression: { type: "Literal", value: codeNode.value, raw },
                  },
                ],
              },
            },
          },
        },
      ],
      children: [],
    };
  }

  /**
   * @param {any} node
   * @returns {any}
   */
  function transform(node) {
    if (Array.isArray(node.children)) {
      node.children = node.children.flatMap((/** @type {any} */ child) => {
        if (child.type === "code" && child.lang === "mermaid") {
          return [child, makeDiagram(child)];
        }
        return [transform(child)];
      });
    }
    return node;
  }

  return (/** @type {any} */ tree) => transform(tree);
}
