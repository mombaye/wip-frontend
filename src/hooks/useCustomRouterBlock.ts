// src/hooks/useCustomRouterBlock.ts
import { useContext, useEffect, useRef, useState } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function useCustomRouterBlock(shouldBlock: boolean) {
  const { navigator } = useContext(NavigationContext);
  const [nextLocation, setNextLocation] = useState<any>(null);
  const unblock = useRef<any>(null);

  useEffect(() => {
    if (!shouldBlock) {
      unblock.current?.();
      return;
    }
    unblock.current = (navigator as any).block((tx: any) => {
      setNextLocation(tx);
      return false;
    });
    return () => unblock.current?.();
    // eslint-disable-next-line
  }, [shouldBlock, navigator]);

  const confirm = () => {
    unblock.current?.();
    nextLocation.retry();
    setNextLocation(null);
  };

  const cancel = () => setNextLocation(null);

  return { nextLocation, confirm, cancel };
}
