import makeStore from '@/shared/hooks/makeStore';

const focusReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'ADD_FOCUS_LIST': {
      return {
        ...state,
        focuses: action.payload
      };
    }
    case 'SET_IS_FOCUS_LOADING': {
      return {
        ...state,
        isFocusLoading: action.payload
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
    case 'SET_IS_TODO_LOADING': {
      return {
        ...state,
        isTodoLoading: action.payload
      };
    }
    case 'ADD_FILTERED_TODO_LIST': {
      return {
        ...state,
        filteredTodos: action.payload
      };
    }
    case 'SET_SELECTED_START_DATE': {
      return {
        ...state,
        selectedStartDay: action.payload
      };
    }
    case 'SET_SELECTED_END_DATE': {
      return {
        ...state,
        selectedEndDay: action.payload
      };
    }
    case 'SET_RANGE': {
      return {
        ...state,
        range: action.payload
      };
    }
    case 'SET_DAYS_OFFSET': {
      return {
        ...state,
        dayOffset: action.payload
      };
    }
  }
};

const [FocusStoreProvider, useFocusStore, useFocusDispatch] = makeStore(focusReducer, {
    focuses: [],
    areas: [],
    todos: [],
    filteredTodos: [],
    isFocusLoading: false,
    isTodoLoading: false,
    selectedStartDay: '--',
    selectedEndDay: '--',
    range: 'daily',
    dayOffset: 0,
});

export { FocusStoreProvider, useFocusStore, useFocusDispatch };
