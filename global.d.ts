import { ExternalProvider } from "ethers";

declare global {
    interface Window {
        ethereum?: ExternalProvider & {
            isMetaMask?: boolean;
            request?: <T>(args: { method: string; params?: unknown[] }) => Promise<T>;
            on?: (eventName: string, callback: (...args: unknown[]) => void) => void;
        };
    }
}