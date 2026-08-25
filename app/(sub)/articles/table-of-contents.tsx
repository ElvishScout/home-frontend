"use client";

import type { HeadingTreeNode } from "virtual:mdx-registry";

interface TableOfContentsProps {
  tree: HeadingTreeNode;
  activeId: string | null;
}

function TocItem({ node, activeId }: { node: HeadingTreeNode; activeId: string | null }) {
  const active = node.id === activeId;

  return (
    <li>
      <a
        href={`#${node.id}`}
        aria-current={active ? "location" : undefined}
        className={active ? "font-semibold text-blue-700" : "text-gray-700 hover:text-gray-950"}
      >
        {node.text}
      </a>
      {node.children.length > 0 && (
        <ul className="mt-1 space-y-1 border-l border-gray-300 pl-3">
          {node.children.map((child) => (
            <TocItem key={child.id} node={child} activeId={activeId} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function TableOfContents({ tree, activeId }: TableOfContentsProps) {
  if (tree.children.length === 0) {
    return null;
  }

  return (
    <nav aria-label="目录">
      <p className="mb-3 text-sm font-semibold text-gray-900">目录</p>
      <ul className="space-y-1 text-sm leading-5">
        {tree.children.map((node) => (
          <TocItem key={node.id} node={node} activeId={activeId} />
        ))}
      </ul>
    </nav>
  );
}
