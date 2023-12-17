import React, { useReducer } from 'react'
import { createContext } from "react";

export const SessionContext = createContext({ loggedUser: {} });

export const actions = {
  getLoggedUser: 'getLoggedUser',
  setLoggedUser: 'setLoggedUser',
  clear: 'clear'
}

function reducer(state, action) {
  switch (action.type) {
    case actions.getLoggedUser:
        return state.loggedUser
    case actions.setLoggedUser:
        return { ...state, loggedUser: action.payload }
    case actions.clear:
      return { ...state, loggedUser: {}}
    default:
      throw new Error("Action doesn't exist")
  }
}

export const SessionProvider = (props) => {
  const [session, dispatch] = useReducer(reducer,{ loggedUser: {} })

  return (
    <SessionContext.Provider value={{ session, dispatch }}>
      {props.children}
    </SessionContext.Provider>
  );
}