import React from "react";
import { PanelBlock } from "./blockTypes";
import SmartButtonRenderer from "./SmartButtonRenderer";

type Props = {
  block: PanelBlock;
  me: string;
};

export default function RenderBlock({ block, me }: Props) {
  switch (block.type) {
    case "text":
      return (
        // <p
        //   className={`
        //     text-${block.size || "base"}
        //     text-${block.align || "center"}
        //     text-gray-700
        // ${block.style || ""}
        //   `.trim()}>
        //   {block.content}
        // </p>
        <p className={block.textClass}>{block.content}</p>
      );

    case "emoji":
      return (
        <div style={{ fontSize: block.size || 32 }} className="text-center">
          {block.emoji}
        </div>
      );

    case "spacer":
      return <div style={{ height: block.height || 16 }} />;

    case "button":
      const isSelected = block.button?.state === "selected";
      const className =
        isSelected && block.buttonClassSelected
          ? block.buttonClassSelected
          : block.buttonClass;
      // console.log("[RenderBlock] final buttonClass:", className);
      return (
        <SmartButtonRenderer
          me={me}
          config={block.button}
          buttonClass={className}
          iconClass={block.iconClass}
        />
      );

    default:
      return null;
  }
}
