import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import NotificationModal from "../components/NotificationModal";

const NotificationContext = createContext(null);

const AUTO_CLOSE_MS = 2500;

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const timerRef = useRef(null);

  const hideNotification = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setNotification((current) => ({ ...current, open: false }));
  }, []);

  const showNotification = useCallback(
    ({ type = "success", title, message = "" }) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setNotification({
        open: true,
        type,
        title,
        message,
      });

      timerRef.current = setTimeout(() => {
        setNotification((current) => ({ ...current, open: false }));
        timerRef.current = null;
      }, AUTO_CLOSE_MS);
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {children}

      <NotificationModal
        open={notification.open}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  return context;
};
