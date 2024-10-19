import {
    createContext,
    Dispatch,
    ReactNode,
    useContext,
    useReducer
  } from 'react';
  
  type UserReducer<State, UserAction> = (
    state: State,
    action: UserAction
  ) => State;
  
  export default function makeStore<State, UserAction>(
    userReducer: UserReducer<State, UserAction>,
    initialState: State,
    key: string = '',
    isPersistent = false
  ) {
    const dispatchContext = createContext<Dispatch<UserAction> | undefined>(
      undefined
    );
    const storeContext = createContext<State>(initialState);
  
    const reducer = (state: State, action: UserAction) => {
      const newState = userReducer(state, action);
      if (isPersistent) localStorage.setItem(key, JSON.stringify(newState));
      return newState;
    };
  
    const StoreProvider = ({ children }: { children: ReactNode }) => {
      const [store, dispatch] = useReducer(reducer, initialState);
      return (
        <dispatchContext.Provider value={dispatch}>
          <storeContext.Provider value={store}>{children}</storeContext.Provider>
        </dispatchContext.Provider>
      );
    };
  
    function useDispatch() {
      const dispatch = useContext(dispatchContext);
      if (!dispatch)
        throw new Error(
          'dispatch must be used under store Provider and it should be define in context'
        );
      return dispatch;
    }
  
    function useStore() {
      const store = useContext(storeContext);
      if (!store) throw new Error('store must be used under store Provider');
      return store;
    }
  
    return [StoreProvider, useStore, useDispatch] as const;
  }
  