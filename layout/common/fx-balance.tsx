import { IAccount } from '@/utils/validators/interfaces'
import {
  currencyFormatter,
  getCurrency,
  useCurrencyFlags,
} from "@/utils/currency";
import { EyeClosedIcon, EyeOpenIcon, OptionsIcon } from "@/components/icons";
import { useGetAccounts } from "@/api/hooks/accounts";
import { useGetClientDetails } from "@/api/hooks/user";
import React, { useState } from 'react'
import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FxOptionsModal } from './send-fx-modal';

export default function FxBalance(props : {wallet: IAccount}) {

  const { wallet } = props
  const [opened, { open, close }] = useDisclosure(false);
  const { isLoading: walletsLoading, data: wallets } = useGetAccounts();
  const getIcon = useCurrencyFlags();
  const [seeBalance, setSeeBalance] = useState(false);
  function toggleBalance(fxId: number) {
    const toggleFXBalance = wallets?.data.find((wallet) => wallet.id === fxId);
      setSeeBalance(!seeBalance);
  }

  function getBalanceText(word: any, seeBalance: boolean): string {
    return seeBalance ? word : "*".repeat(word.length);
  }
  return (
    <div
      key={wallet.id}
      className="px-4 py-3 bg-white flex flex-col gap-y-4 justify-between rounded-xl border-1 border-[#A9BADA]"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-2 items-center ">
          <div className="w-[74px] flex items-center gap-1 text-sm font-normal px-2 py-[10px] rounded-xl bg-[#F7F9FD] border-1 border-[#D7E1F4] text-[#1B2437]">
            {getIcon(wallet.currency.code)}
            <span>{wallet.currency.code}</span>
          </div>
          <span role="button" onClick={() => toggleBalance(wallet.id)}>
            {
              seeBalance ? <EyeClosedIcon  /> : <EyeOpenIcon  />
            }
          </span>
        </div>
        <Button variant='subtle' className='p-0' onClick={open}>
          <OptionsIcon />
        </Button>
      </div>
      <span className="text-[#4C689E] font-semibold text-xl">
        {getCurrency(wallet.currency.code)}
        {getBalanceText(currencyFormatter(Number(wallet.true_balance)), seeBalance)}
      </span>
      <FxOptionsModal title={wallet.currency.name} close={close} optionsOpen={opened} />
    </div>
    )
}
