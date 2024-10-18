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
    default: {
      return state;
    }
  }
};
const todoReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_TODO_LIST': {
      return {
        ...state,
        todayTodo: action.payload
      } 
    }
    default: {
      return state;
    }
  }
}
const routineReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'ADD_ROUTINE_LIST': {
      return {
        ...state,
        routines: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
const rootReducer = (state: any, action: any) => {
  return {
    focus: focusReducer(state.focus, action),
    todo: todoReducer(state.todo, action),
    routine: routineReducer(state.routine, action)
  }
}

const [StoreProvider, useStore, useDispatch] = makeStore(rootReducer, {
  focus: {
    focuses: [],
    areas: [],
    isFocusLoading: false,
    selectedStartDay: '--',
    selectedEndDay: '--',
    range: 'daily',
    dayOffset: 0,
  },
  todo: {
    todayTodo: [],
    completedTodo: [],
    archivedTodo: [],
  },
  routine: {
    routines: [],
  }
});

export { StoreProvider, useStore, useDispatch };