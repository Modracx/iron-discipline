"use client";

import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}

export const STORAGE_KEY_FLAG = "iron_discipline_unlocked_tiers";
export const STORAGE_KEY_CLEARANCE = "iron-discipline:clearance";

export function checkIsClassifiedUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const flag = localStorage.getItem(STORAGE_KEY_FLAG);
    const clearance = localStorage.getItem(STORAGE_KEY_CLEARANCE);
    return (
      flag === "true" ||
      clearance === "BRUTAL" ||
      clearance === "MILITARY" ||
      clearance === "unlocked" ||
      clearance === "true"
    );
  } catch {
    return false;
  }
}

export default function ClearanceTerminal({ isOpen, onClose, onUnlocked }: Props) {
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthorize = (code: string) => {
    const clean = code.trim().toUpperCase();
    const VALID_CODES = [
      "BRUTAL",
      "SEMPER_FI",
      "OVERKILL",
      "COMMANDO",
      "IRON",
      "DISCIPLINE",
      "CLASSIFIED",
    ];

    if (VALID_CODES.includes(clean)) {
      try {
        localStorage.setItem(STORAGE_KEY_FLAG, "true");
        localStorage.setItem(STORAGE_KEY_CLEARANCE, "BRUTAL");
      } catch {}
      setSuccessMsg("SECURITY OVERRIDE CONFIRMED // CLEARANCE LEVEL GRANTED");
      setErrorMsg(null);
      setTimeout(() => {
        onUnlocked();
        onClose();
      }, 1000);
    } else {
      setErrorMsg("INVALID CREDENTIAL // ACCESS DENIED");
      setSuccessMsg(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/85 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md border-4 border-blood bg-pit p-6 shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b-2 border-blood pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-blood animate-ping" />
            <h3 className="font-stencil text-2xl text-blood">
              RESTRICTED CLEARANCE
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer font-cond text-sm font-bold text-drab hover:text-bone"
          >
            [CLOSE ✕]
          </button>
        </div>

        {/* Terminal Body */}
        <div className="mt-4 space-y-4 font-cond">
          <div className="border-l-4 border-blood pl-3 text-xs text-bone/90 leading-relaxed">
            <p className="font-bold text-blood">SECURITY ACCESS RESTRICTED</p>
            <p className="text-drab mt-1">
              Military and Brutal calisthenics protocols require verified authorization. Unauthorized personnel are prohibited.
            </p>
          </div>

          <div className="border border-line bg-night p-4">
            <label
              htmlFor="clearance-code-input"
              className="block text-xs font-bold tracking-[0.2em] text-drab mb-2"
            >
              ENTER ACCESS CREDENTIAL:
            </label>
            <div className="flex gap-2">
              <input
                id="clearance-code-input"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••••••"
                className="flex-1 border-2 border-line bg-pit px-3 py-2 font-mono text-sm uppercase text-bone tracking-widest focus:border-blood focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleAuthorize(passcode)}
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleAuthorize(passcode)}
                className="cursor-pointer border-2 border-blood bg-blood px-4 py-2 font-cond text-sm font-bold tracking-wider text-night hover:bg-blood/80 transition-colors"
              >
                VERIFY
              </button>
            </div>
            {errorMsg && (
              <p className="mt-2 text-xs font-bold text-blood animate-pulse">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="mt-2 text-xs font-bold text-go">{successMsg}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t-2 border-line pt-3 font-cond text-xs font-bold">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border-2 border-line px-4 py-1.5 text-drab hover:border-bone hover:text-bone transition-colors"
          >
            CANCEL // STAND DOWN
          </button>
        </div>
      </div>
    </div>
  );
}
