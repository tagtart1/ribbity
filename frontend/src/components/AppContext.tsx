import { createContext } from "react";

const defaultUser: any = {
  loadingHandler: () => {},
  mainUser: null,
};

const AppContext: any = createContext(defaultUser);

export default AppContext;
