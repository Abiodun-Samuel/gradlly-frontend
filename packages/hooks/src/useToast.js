import toast from "react-hot-toast";

const DEFAULT_TOAST_DURATION = 3500;

const TOAST_POSITION = "top-center";

const toastOptions = {
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

const withDefaults = (options) => ({
  duration: DEFAULT_TOAST_DURATION,
  ...options,
});

export const toasterConfig = {
  position: TOAST_POSITION,
  toastOptions,
};

export const toastSuccess = (message, options) =>
  toast.success(message, withDefaults(options));

export const toastError = (message, options) =>
  toast.error(message, withDefaults(options));

export const toastLoading = (message, options) =>
  toast.loading(message, withDefaults(options));

export const toastDefault = (message, options) =>
  toast(message, withDefaults(options));
