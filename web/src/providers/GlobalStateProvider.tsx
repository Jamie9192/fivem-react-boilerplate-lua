import { useNuiEvent } from "@/hooks/useNuiEvent";
import { fetchNui } from "@/utils/fetchNui";
import { isEnvBrowser } from "@/utils/misc";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface GlobalStateI {
  visible: boolean;
}

const defaultGlobals: GlobalStateI = {
  visible: isEnvBrowser(),
}


const GlobalContext = createContext<[GlobalStateI, (state: string, value: any) => void, (newState: Record<string, any>) => void]>([defaultGlobals, () => {}, () => {}]);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {

  const [globalState, setFullState] = useState<GlobalStateI>(defaultGlobals);
  
  const setGlobalState = (state: string, value: any): void => setFullState((prev: GlobalStateI) => ({ ...prev, [state]: value }));
  const setGlobalStateObject = (newState: Record<string, any>): void => setFullState((prev: GlobalStateI) => ({ ...prev, ...newState }));
  
  useNuiEvent("state", (data: {[key: string]: any}) => setFullState((prev: GlobalStateI) => ({ ...prev, ...data })));

  useEffect(() => {
      if (!globalState.visible) return;
  
      const keyHandler = (e: KeyboardEvent) => {
        if (["Escape"].includes(e.code)) {
          if (!isEnvBrowser()) fetchNui("hideFrame");
          else setGlobalState("visible", !globalState.visible);
        }
      };
  
      window.addEventListener("keydown", keyHandler);
  
      return () => window.removeEventListener("keydown", keyHandler);
    }, [globalState.visible]);

  return (
    <GlobalContext.Provider value={[globalState, setGlobalState, setGlobalStateObject]}>
      <div className={`${globalState.visible ? "" : "hidden"} w-full h-full`}>
        {children}
      </div>
    </GlobalContext.Provider>
  );

}

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};