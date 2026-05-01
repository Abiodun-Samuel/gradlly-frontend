export const DEFAULT_TOAST_DURATION = 3500;

export const TOAST_POSITION = "top-center";

export const toastOptions = {
  duration: DEFAULT_TOAST_DURATION,
  style: {
    borderRadius: "10px",
    fontSize: "14px",
    padding: "12px 14px",
  },
  success: {
    iconTheme: {
      primary: "#22c55e",
      secondary: "#f8fafc",
    },
  },
  error: {
    iconTheme: {
      primary: "#ef4444",
      secondary: "#f8fafc",
    },
  },
  loading: {
    iconTheme: {
      primary: "#38bdf8",
      secondary: "#f8fafc",
    },
  },
};

export const toasterConfig = {
  position: TOAST_POSITION,
  toastOptions,
};
