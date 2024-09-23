import makeStore from '@/shared/hooks/makeStore';

const focusReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'ADD_FOCUS_LIST': {
      return {
        ...state,
        focus: action.payload
      };
    }
  }
};

const [FocusStoreProvider, useFocusStore, useFocusDispatch] = makeStore(focusReducer, {
    focusList: [],
});

export { FocusStoreProvider, useFocusStore, useFocusDispatch };
