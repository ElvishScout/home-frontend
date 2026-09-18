"use client";

import type { ImgHTMLAttributes } from "react";
import { ZoomViewer } from "./zoom-viewer";

/**
 * 正文图片的渲染件，在 mdx-components.tsx 注册（与 MermaidDiagram 同款）。
 * markdown 的 `![alt](./graph.png)` 由 plugins/remark-mdx-image.mjs 在编译期
 * 换成 <ImageViewer> 节点，相对路径展开成 static import，所以这里拿到的
 * src 直接可用，width / height 来自打包器的 StaticImageData。
 * 站点绝对路径与外链同样会进来，只是 src 是原样的字符串。
 *
 * 点击全屏 + 缩放交给 ZoomViewer。
 */
export function ImageViewer({ src, alt, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <ZoomViewer label={alt || "图片"}>
      <img {...rest} src={src} alt={alt ?? ""} draggable={false} className="image-viewer" />
    </ZoomViewer>
  );
}
