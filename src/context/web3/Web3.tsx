import {
  appChainId,
  blockExplorerUrl,
  chainName,
  moralisApiKey,
  rpcUrl,
  symbol,
} from "@/constants/environment";
import { MetaMaskInpageProvider } from "@metamask/providers";
import Moralis from "moralis";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Web3 from "web3";
import { AbstractProvider } from "web3-core";

import {
  IWeb3Value,
  NoMetamaskError,
  ProviderConnectInfo,
  UnAuthorizedMetamaskError,
  UserRejectedRequestError,
} from "./type";

export const Web3Context = createContext<IWeb3Value>({
  isConnected: false,
  account: "string",
  chainId: " string",
  web3: undefined,
  connect: () => Promise.resolve(""),
  metamask: undefined,
  isLoading: false,
  startMoralis: () => Promise.resolve(),
});

export function Web3Provider({ children }: React.PropsWithChildren) {
  const [account, setAccount] = useState<string | undefined>(
    (typeof window !== "undefined" && window.localStorage.getItem("address")) ||
      undefined
  );

  const web3 = useRef<Web3>();
  const metamask = useRef<MetaMaskInpageProvider>();
  const [chainId, setChainId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isConnected = useMemo(() => !!account, [account]);

  const handleChainChanged = useCallback((chainId: unknown): void => {
    setChainId(chainId as string);
  }, []);
  const handleAccountChanged = useCallback((accounts: unknown): void => {
    if (!!accounts && Array.isArray(accounts) && accounts.length) {
      setAccount(accounts[0]);
    } else {
      setAccount(undefined);
    }
  }, []);
  const handleConnect = useCallback((params: unknown): void => {
    if ((params as ProviderConnectInfo).chainId) {
      setChainId((params as ProviderConnectInfo).chainId);
    }
  }, []);
  const handleDisconnect = useCallback((): void => {
    setAccount(undefined);
  }, []);

  const connect = useCallback(async (withoutStartMetamask?: boolean) => {
    setIsLoading(true);
    if (metamask.current) {
      try {
        const [accounts, chainId] = await Promise.all([
          metamask.current.request<string[]>({
            method: "eth_requestAccounts",
          }),
          metamask.current.request<string>({
            method: "eth_chainId",
          }),
        ]);
        if (accounts && accounts.length && !!accounts[0]) {
          setAccount(accounts[0]);
          if (typeof chainId === "string") {
            setChainId(chainId);
            try {
              if (appChainId !== chainId)
                await metamask.current.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: appChainId }], // chainId must be in hexadecimal numbers
                });
            } catch (error) {
              if ((error as any).code === 4902) {
                await metamask.current.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: appChainId,
                      rpcUrls: [rpcUrl],
                      chainName: chainName,
                      nativeCurrency: {
                        symbol: symbol,
                        decimals: 18,
                      },
                      blockExplorerUrls: [blockExplorerUrl],
                    },
                  ],
                });
              }
            }
          }

          setIsLoading(false);
          return Promise.resolve(accounts[0]);
        } else {
          setAccount(undefined);
          setIsLoading(false);
          return Promise.reject(new UnAuthorizedMetamaskError());
        }
      } catch (error: unknown) {
        setAccount(undefined);
        setIsLoading(false);

        if ((error as any).code === 4001) {
          return Promise.reject(new UserRejectedRequestError());
        }

        return Promise.reject(new UnAuthorizedMetamaskError());
      }
    } else {
      setAccount(undefined);
      setIsLoading(false);
      if (!withoutStartMetamask) {
        window.open("https://metamask.io/download", "_blank")?.focus();
      }

      return Promise.reject(new NoMetamaskError());
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      metamask.current = window.ethereum;
    }
  }, []);

  useEffect(() => {
    if (metamask.current) {
      const provider = new Web3(metamask.current as AbstractProvider);
      web3.current = provider;
      if (account) {
        !!window.localStorage && localStorage.setItem("address", account);
        metamask.current.on("connect", handleConnect);
        metamask.current.on("disconnect", handleDisconnect);
        metamask.current.on("chainChanged", handleChainChanged);
        metamask.current.on("accountsChanged", handleAccountChanged);
      } else {
        !!window.localStorage && localStorage.removeItem("address");
        setAccount(undefined);
        setChainId(undefined);
        web3.current = undefined;
        return () => {
          if (metamask.current && metamask.current.removeListener) {
            metamask.current.removeListener("connect", handleConnect);
            metamask.current.removeListener("disconnect", handleDisconnect);
            metamask.current.removeListener("chainChanged", handleChainChanged);
            metamask.current.removeListener(
              "accountsChanged",
              handleAccountChanged
            );
          }
        };
      }
    }
  }, [
    account,
    handleAccountChanged,
    handleChainChanged,
    handleConnect,
    handleDisconnect,
  ]);

  useEffect(() => {
    const account = !!window.localStorage && localStorage.getItem("address");
    if (account) {
      connect(true).catch(() => {
        !!window.localStorage && localStorage.removeItem("address");
      });
    }
  }, [connect]);
  const startMoralis = useCallback(async () => {
    try {
      await Moralis.start({
        apiKey: moralisApiKey,
      });
    } catch (error) {
      console.log("🚀 ~ file: Web3.tsx:199 ~ startMoralist ~ error:", error);
    }
  }, []);

  useEffect(() => {
    startMoralis();
  }, [startMoralis]);

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        account,
        chainId,
        web3: web3.current,
        metamask: metamask.current,
        connect,
        isLoading,
        startMoralis,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);
