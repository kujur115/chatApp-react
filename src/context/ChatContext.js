import { createContext, useContext, useReducer } from "react";

import { AuthContext } from "./AuthContext";

// Context
export const ChatContext = createContext();

// Provider
export const ChatProvider = ({ children }) => {
  const { User } = useContext(AuthContext);
  const INITIAL_STATE = {
    user: {},
    chatId: "null",
  };
  const chatReducer = (state, action) => {
    switch (action.type) {
      case "USER_CHANGE":
        return {
          user: action.payload,
          chatId:
            User.uid > action.payload.uid
              ? User.uid + action.payload.uid
              : action.payload.uid + User.uid,
        };

      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  const value = { data: state, dispatch };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
