// @refresh skip
import { createContext } from "react";

const KEY = "__RT_GAME_STATE_CONTEXT__";

export const GameStateContext =
  globalThis[KEY] || (globalThis[KEY] = createContext(null));