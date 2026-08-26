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
        className={`inline-block px-1.5 py-0.5 text-sm leading-snug transition-colors duration-300 ${
          active ? "bg-acid font-bold text-ink" : "text-ink/60 hover:text-ink"
        }`}
      >
        {node.text}
      </a>
      {node.children.length > 0 && (
        <ul className="mt-1 ml-1.5 space-y-1 border-l-2 border-ink/20 pl-3">
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
      <p className="mb-4 font-spacemono text-xs font-bold tracking-22 opacity-60">INDEX</p>
      <ul className="space-y-1.5">
        {tree.children.map((node) => (
          <TocItem key={node.id} node={node} activeId={activeId} />
        ))}
      </ul>
    </nav>
  );
}
