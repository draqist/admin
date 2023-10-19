import { useGetAccounts } from "@/api/hooks/accounts";
import { useGetClientDetails } from "@/api/hooks/user";
import { EyeClosedIcon, EyeOpenIcon, OptionsIcon } from "@/components/icons";
import {
  currencyFormatter,
  getCurrency,
  useCurrencyFlags,
} from "@/utils/currency";
import { Skeleton } from "@mantine/core";
import { ReactNode, useState } from "react";
import FxBalance from "../common/fx-balance";

export function Wallets({ userId }: { userId: number | undefined }) {
  const getIcon = useCurrencyFlags();
  const { data: clientDetails, isLoading: clientDetailsLoading } =
    useGetClientDetails(userId);
  const { isLoading: walletsLoading, data: wallets } = useGetAccounts();
  const [seeBalance, setSeeBalance] = useState(false);
  function toggleBalance(fxId: number) {
    const toggleFXBalance = wallets?.data.find((wallet) => wallet.id === fxId);
      setSeeBalance(!seeBalance);
  }

  function getBalanceText(word: any, seeBalance: boolean): string {
    return seeBalance ? word : "*".repeat(word.length);
  }

  
  if (clientDetailsLoading || walletsLoading) {
    return (
      <WalletsContainer>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </WalletsContainer>
    );
  }
  return (
    <WalletsContainer>
      {wallets?.data
        .filter((wallet) => wallet.category !== "local")
        .map((wallet) => (
          <FxBalance wallet={wallet} />
        ))}
      {/* <div className="px-4 py-3 bg-white flex items-center gap-4 justify-between rounded-md border">
        <span className="mr-auto">
          {getCurrency("NGN")}
          {clientDetails?.data.result?.walletBalance
            ? currencyFormatter(clientDetails?.data.result?.walletBalance)
            : "0.00"}
        </span>
        <CircleNigerianFlag />

        {clientDetails?.data.result && (
          <Popover position="bottom" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon>
                <ArrowDown2 />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <section className="flex flex-col gap-6 p-2">
                {clientDetails?.data.result?.gatewaybalances.map((gateway) => (
                  <div
                    key={gateway.gatewayId}
                    className="text-gray-90 flex gap-10 justify-between font-normal text-sm"
                  >
                    <span>{gateway.gatewaydescription}</span>
                    <span>₦ {currencyFormatter(gateway.balance)}</span>
                  </div>
                ))}
              </section>
            </Popover.Dropdown>
          </Popover>
        )}
      </div> */}
    </WalletsContainer>
  );
}

function WalletsContainer({ children }: { children: ReactNode }) {
  return (
    <div className="py-6 px-6 bg-white rounded-3xl border font-semibold flex flex-col gap-4">
      <section className="flex justify-between items-center text-primary-70 text-sm">
        <div>
          <p className="text-2xl text-semibold mb-2 text-[#6882B6]">FX Balances</p>
          <span className="text-black font-normal text-base">Click on the account for more information</span>
        </div>
        <span role="button" className="text-[#03A1DB] font-semibold">Request Additional Account </span>
        {/* <span>Hide balance</span> */}
      </section>

      <section className="grid grid-cols-3 rounded-[18px] p-3 grid-rows-[repeat(1   ,_minmax(4rem,_auto))] gap-4 mt-3 bg-[#EFF3FB] ">
        {children}
      </section>
    </div>
    // <div className="py-6 px-5 bg-gray-30 rounded-lg border font-semibold flex flex-col gap-4">
    //   <section className="flex justify-between text-primary-70 text-sm">
    //     <span>Wallet Balance</span>
    //     {/* <span>Hide balance</span> */}
    //   </section>

    //   <section className="grid grid-cols-2 grid-rows-[repeat(2,_minmax(4rem,_auto))] gap-4">
    //     {children}
    //   </section>
    // </div>
  );
}
