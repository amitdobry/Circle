import { useNavigate } from "react-router-dom";
import { APP_VERSION } from "./../version";

(window as any).APP_VERSION = APP_VERSION;
export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-rose-100 text-gray-800 flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
        Welcome to SoulCircle
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl text-center">
        A sacred space for intentional presence. Speak when heard. Witness when
        listening. Align with the rhythm of many minds.
      </p>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <button
          onClick={() => navigate("/name")}
          className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-semibold text-lg shadow hover:bg-emerald-600 transition">
          Take a Seat
        </button>
        <button
          onClick={() => navigate("/room?mode=observer")}
          className="px-6 py-3 rounded-lg bg-white text-emerald-600 border border-emerald-300 font-semibold text-lg shadow hover:bg-emerald-50 transition">
          Observe
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow max-w-2xl text-center text-gray-700">
        <h2 className="text-xl font-semibold mb-2">How It Works</h2>
        <p className="text-sm mb-1">
          ✦ Join a circle as an observer or participant.
        </p>

        <p className="text-sm mb-1">
          ✦ All must point to one for that voice to be heard.
        </p>
        <p className="text-sm">
          ✦ The moment of unity becomes the moment of speech.
        </p>
      </div>

      <footer className="mt-12 text-sm text-gray-400 text-center">
        A digital ritual by design. ✦ Built with love by{" "}
        <span className="text-gray-500 font-medium">Amit Abraham Dobry</span>.{" "}
        <span className="inline-block">🌀</span> Version: {APP_VERSION}
      </footer>
    </div>
  );
}
