let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

export const setDispatch = () => {
  return store.dispatch;
};
