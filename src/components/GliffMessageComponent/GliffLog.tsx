import React, { JSX } from "react";
import { GliffMessage } from "../../types/gliffMessage";

type Props = {
  entries: GliffMessage[];
  me: string;
};

function collapseStream(entries: GliffMessage[]): JSX.Element[] {
  const parts: JSX.Element[] = [];
  let currentSpeaker: string | null = null;
  let currentElements: (string | JSX.Element)[] = [];

  const flush = (key: string) => {
    if (currentSpeaker && currentElements.length > 0) {
      parts.push(
        <div key={key} className="whitespace-pre-wrap mb-1 font-semibold">
          <b>{currentSpeaker}</b>: {currentElements}
        </div>
      );
    }
    currentElements = [];
  };

  for (let i = 0; i < entries.length; i++) {
    const { userName, message } = entries[i];

    if (message.messageType === "textInput") {
      if (!currentSpeaker || userName !== currentSpeaker) {
        flush(`flush-${i}`);
        currentSpeaker = userName;
      }
      currentElements.push(message.content);
    } else if (message.messageType === "gesture") {
      // Inline gestures are added to the current speaker's block
      currentElements.push(
        <span
          key={`gesture-${i}`}
          title={`${userName}: ${message.content}`}
          className="inline-block mx-1 text-xl text-indigo-600 align-middle cursor-default">
          {message.emoji}
        </span>
      );
    }
  }

  flush("final");
  return parts;
}

export default function GliffLog({ entries, me }: Props) {
  const collapsed = collapseStream(entries);

  return (
    <div className="flex flex-col justify-center items-center h-full px-4 py-7 text-[#3a2e22] font-serif text-[11px] sm:text-xs text-center leading-tight overflow-y-auto max-w-[70%] sm:max-w-[65%]">
      {collapsed}
    </div>
  );
}
