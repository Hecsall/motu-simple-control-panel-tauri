import { useEffect, useReducer, createContext, useContext, useMemo } from "react";

// Reference
// https://medium.com/geekculture/how-to-use-context-usereducer-and-localstorage-in-next-js-cc7bc925d3f2

export const initialState = {
  osType: null,
  apiBaseUrl: '',
  apiBaseUrlValid: false,
  datastoreReady: false,
  debug: false,
};


export const AppReducer = (state, action) => {
  switch (action.type) {
    
    case "init_stored": {
      state.debug && console.info("Store: initialized from localStorage")
      return action.value;
    }

    /**
     * type: reset_settings
     * Resets store to initial value, but keeps osType
     */
    case "reset_settings": {
      state.debug && console.info('Store: reset_settings');
      return {
        ...initialState,
        osType: state.osType
      };
    }

    /**
     * type: set
     * key: 'someKey'
     * value: 'someValue'
     * Set a key-value inside the store
     */
    case "set": {
      state.debug && console.info(`Store: set - ${action.key}`)
      return {
        ...state,
        [action.key]: action.value,
      };
    }
  }
};


const AppContext = createContext();


export function AppWrapper({ children }) {
  const [ state, dispatch ] = useReducer(AppReducer, initialState);
  const contextValue = useMemo(() => {
     return { state, dispatch };
  }, [state, dispatch]);
  
  useEffect(() => {
    const localSavedContext = JSON.parse(localStorage.getItem("state"));
    if (localSavedContext) {
      let usableContext = localSavedContext;

      const localKeys = Object.keys(localSavedContext).sort();
      const defaultKeys = Object.keys(initialState).sort();

      const localEqualDefault = localKeys.every(element => {
        if (defaultKeys.includes(element)) {
          return true;
        }
      });

      if (!localEqualDefault) {
        Object.keys(usableContext).forEach(key => {
          if (!initialState[key]) {
            delete usableContext[key];
          }
        });

        Object.keys(initialState).forEach(key => {
          if (!usableContext[key]) {
            usableContext[key] = initialState[key];
          }
        });
      }

       dispatch({ 
          type: "init_stored", 
          value: usableContext,
       });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state !== initialState) {
      localStorage.setItem("state", JSON.stringify(state));
    }
  }, [state]);

  return (
     <AppContext.Provider value={contextValue}>
        {children}
     </AppContext.Provider>
  );
}


export function useAppContext() {
  return useContext(AppContext);
}