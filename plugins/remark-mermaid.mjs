// @ts-check

/**
 * remark 插件：把 ```mermaid 代码块替换为 <MermaidDiagram code={...}> 组件节点，
 * 让图表在编译期成为 MDX 组件，而不是客户端再查 pre、动 DOM。
 * 组件本体在 mdx-components.tsx 注册（components/mermaid-diagram.tsx）。
 *
 * code 以表达式属性传入（字符串字面量的 estree），源码里的换行与花括号
 * 不经过 MDX 文本解析，不会被误当成 JSX 或表达式。
 */
export default function remarkMermaid() {
  /**
   * @param {any} node
   * @returns {any}
   */
  function transform(node) {
    if (node.type === "code" && node.lang === "mermaid") {
      const raw = JSON.stringify(node.value);
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
                      expression: { type: "Literal", value: node.value, raw },
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
    if (Array.isArray(node.children)) {
      node.children = node.children.map(transform);
    }
    return node;
  }

  return (/** @type {any} */ tree) => transform(tree);
}
