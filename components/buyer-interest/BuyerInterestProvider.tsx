"use client";

// Buyer-interest provider + modal portal.
//
// Wraps the property-profile pages and renders the modal at the body root so
// it sits above every other surface. The trigger buttons (BuyerInterestButton)
// consume this context to open the modal with the right entity payload.
//
// `useBuyerInterest()` is consumer-only — calling it outside the Provider
// throws so we catch missing-wiring at runtime rather than silently failing.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { track } from "@/lib/horace/track";
import { BuyerInterestModal } from "./BuyerInterestModal";

export type BuyerInterestEntity = {
  complexSlug: string;
  complexName: string;
  /** Provide on a unit profile so the button defaults to a unit-level registration. */
  unitNumber?: number;
};

export type BuyerInterestRequest = {
  type: "complex" | "unit";
  /** Only required on type="unit". */
  unitNumber?: number;
};

type BuyerInterestState = (BuyerInterestRequest & { open: true }) | { open: false };

type Ctx = {
  state: BuyerInterestState;
  open: (req: BuyerInterestRequest) => void;
  close: () => void;
  entity: BuyerInterestEntity;
};

const BuyerInterestCtx = createContext<Ctx | null>(null);

export function BuyerInterestProvider({
  entity,
  children,
}: {
  entity: BuyerInterestEntity;
  children: ReactNode;
}) {
  const [state, setState] = useState<BuyerInterestState>({ open: false });

  const open = useCallback(
    (req: BuyerInterestRequest) => {
      setState({ ...req, open: true });
      if (req.type === "unit" && req.unitNumber !== undefined) {
        track.unitBuyerInterestOpened({
          complexId: entity.complexSlug,
          unitId: `unit-${req.unitNumber}`,
        });
      } else {
        track.complexBuyerInterestOpened({ complexId: entity.complexSlug });
      }
    },
    [entity.complexSlug],
  );
  const close = useCallback(() => setState({ open: false }), []);

  const value = useMemo<Ctx>(
    () => ({ state, open, close, entity }),
    [state, open, close, entity],
  );

  return (
    <BuyerInterestCtx.Provider value={value}>
      {children}
      {/* Conditional mount — gives every open() a fresh modal with default
          step/email state. Avoids resetting via useEffect (cascading-render
          smell flagged by react-hooks/set-state-in-effect). */}
      {state.open && (
        <BuyerInterestModal
          type={state.type}
          unitNumber={state.unitNumber}
          entity={entity}
          onClose={close}
        />
      )}
    </BuyerInterestCtx.Provider>
  );
}

export function useBuyerInterest(): Ctx {
  const ctx = useContext(BuyerInterestCtx);
  if (!ctx) {
    throw new Error(
      "useBuyerInterest must be used inside <BuyerInterestProvider>",
    );
  }
  return ctx;
}
