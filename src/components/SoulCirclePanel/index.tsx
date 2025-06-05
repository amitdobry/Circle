import React, { useEffect } from "react";
import { usePanelLayoutConfig } from "./usePanelLayoutConfig"; // <-- you built this hook!
import RenderBlock from "./RenderBlock";
import socket from "../../socket"; // 👈 make sure to import socket
// import { testPanel } from "./panelPresets";

type Props = {
  me: string;
};

export default function SoulCirclePanel({ me }: Props) {
  const { panelConfig, fetchPanelLayout } = usePanelLayoutConfig(me);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchPanelLayout(); // on mount
  }, []);

  // 🔥 Listen for table updates and re-fetch config when needed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const refresh = () => {
      console.log(
        "[SoulCirclePanel] Detected change, re-fetching panel config"
      );
      fetchPanelLayout();
    };

    socket.on("user-list", refresh);
    socket.on("avatars", refresh);
    socket.on("live-speaker", refresh);
    socket.on("initial-pointer-map", refresh);

    return () => {
      socket.off("user-list", refresh);
      socket.off("avatars", refresh);
      socket.off("live-speaker", refresh);
      socket.off("initial-pointer-map", refresh);
    };
  }, []);

  // const panelConfigTest = testPanel; // 🧪 skip socket for now
  // const panelConfigTest = testPanelAttention; // 🧪 skip socket for now
  // const panelConfigTest = testPanelListenerState1; // 🧪 skip socket for now
  // const panelConfigTest = testPanelListenerState2; // 🧪 skip socket for now
  // const panelConfigTest = testPanelListenerState3; // 🧪 skip socket for now
  // const panelConfigTest = testPanelListenerState4; // 🧪 skip socket for now

  if (!panelConfig) {
    return (
      <div className="text-center text-sm text-gray-400 mt-8">
        🌀 Loading SoulCircle UI...
      </div>
    );
  }

  const panelKey = panelConfig[0]?.id || "default-panel";

  const topScopeStyle =
    panelConfig.find((section) => section.topScopeStyle)?.topScopeStyle ||
    "p-4 border border-white/85 rounded-xl flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-105";

  // <div className="p-4 border border-white/85 rounded-xl flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-105">

  return (
    <div key={panelKey} className={topScopeStyle}>
      {panelConfig.map((panelSection) => {
        switch (panelSection.layout) {
          case "row":
            switch (panelSection.panelType) {
              case "attentionPanel":
                return (
                  <div
                    key={panelSection.id}
                    className={
                      panelSection.panelStyle || "default-class-if-needed"
                    }>
                    {panelSection.blocks.map((block) => (
                      <RenderBlock key={block.id} block={block} me={me} />
                    ))}
                  </div>
                );

              case "speakerPanel":
                return (
                  <div
                    key={panelSection.id}
                    className="flex flex-row justify-center gap-2">
                    {panelSection.blocks.map((block) => (
                      <RenderBlock key={block.id} block={block} me={me} />
                    ))}
                  </div>
                );

              default:
                return (
                  <div
                    key={panelSection.id}
                    className="flex flex-wrap justify-center gap-2">
                    {panelSection.blocks.map((block) => (
                      <RenderBlock key={block.id} block={block} me={me} />
                    ))}
                  </div>
                );
            }

          case "column":
            switch (panelSection.panelType) {
              case "speakerPanel":
                console.log(
                  `[SoulCirclePanel] Rendering COLUMN speaker panel for: ${me}`,
                  panelSection
                );
                return (
                  <div
                    key={panelSection.id}
                    className="flex flex-col items-center gap-3">
                    {panelSection.blocks.map((block) => (
                      <RenderBlock key={block.id} block={block} me={me} />
                    ))}
                  </div>
                );

              case "thinkingPanel":
                return (
                  <div
                    key={panelSection.id}
                    className="flex flex-col items-center gap-3 bg-yellow-50 p-4 rounded shadow">
                    {panelSection.blocks.map((block) => (
                      <RenderBlock key={block.id} block={block} me={me} />
                    ))}
                  </div>
                );

              default:
                return (
                  <div
                    key={panelSection.id}
                    className="flex flex-col items-center gap-2">
                    {panelSection.blocks.map((block) => (
                      <RenderBlock key={block.id} block={block} me={me} />
                    ))}
                  </div>
                );
            }

          default:
            return (
              <div
                key={panelSection.id}
                className="flex flex-col items-center gap-2">
                {panelSection.blocks.map((block) => (
                  <RenderBlock key={block.id} block={block} me={me} />
                ))}
              </div>
            );
        }
      })}
    </div>
  );
}
