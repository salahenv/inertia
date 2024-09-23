import { useState, useEffect, createContext, useContext } from "react";


interface AppContextType {
  deviceType?: string;
}
const AppContext = createContext({} as AppContextType);

function AppDataProvider({ context, children }: any) {
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    const updateDeviceType = () => {
      const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
      const mobile = Boolean(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
          userAgent
        )
      );
      const isMobileScreen = window.innerWidth < 768;
      setDeviceType(mobile || isMobileScreen ? "mobile" : "desktop");
    };

    updateDeviceType();

    window.addEventListener("resize", updateDeviceType); // Handle screen resize
    return () => window.removeEventListener("resize", updateDeviceType); // Cleanup listener
  }, []);
  return <AppContext.Provider value={{deviceType: deviceType}} >{children}</AppContext.Provider>;
}

function useAppData() {
  const context = useContext(AppContext);
  return context;
}

export {
  AppDataProvider,
  useAppData 
}
