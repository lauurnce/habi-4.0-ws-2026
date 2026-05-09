import { LOAStatus } from "../components/LOATracker";

// Simple reactive state for the UI demo
type Listener = (status: LOAStatus) => void;
let currentStatus: LOAStatus = "review";
const listeners = new Set<Listener>();

export const loaState = {
  getStatus: () => currentStatus,
  setStatus: (status: LOAStatus) => {
    currentStatus = status;
    listeners.forEach((l) => l(status));
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
