import makeStore from '@/shared/hooks/makeStore';

const focusReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'ADD_FOCUS_LIST': {
      return {
        ...state,
        focuses: action.payload
      };
    }
    case 'ADD_AREA_LIST': {
      return {
        ...state,
        areas: action.payload
      };
    }
    case 'ADD_TODO_LIST': {
      return {
        ...state,
        todos: action.payload
      };
    }
    case 'ADD_FILTERED_TODO_LIST': {
      return {
        ...state,
        filteredTodos: action.payload
      };
    }
  }
};

const [FocusStoreProvider, useFocusStore, useFocusDispatch] = makeStore(focusReducer, {
    focuses: [],
    areas: [],
});

export { FocusStoreProvider, useFocusStore, useFocusDispatch };
