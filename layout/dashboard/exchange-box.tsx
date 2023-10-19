import { ConvertIcon } from "@/components/icons";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { useCurrencyOptions } from "@/api/hooks/currencies";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useGetRates } from "@/api/hooks/admin/rates";
import { Warning2 } from "iconsax-react";
import { currencyFormatter } from "@/utils/currency";
import { useExchange } from "@/api/hooks/exchange";
import { useFxBalance } from "@/api/hooks/balance";
import { showNotification } from "@mantine/notifications";
import { useGetAllAccounts } from "@/api/hooks/fx";

export function ExchangeBox() {
  const { data: userAccounts, isLoading: _userAccountsLoading } =
    useGetAllAccounts();
  const {
    isLoading: currenciesLoading,
    currencyOptionsWithId,
    currencyOptions,
  } = useCurrencyOptions();
  const { data: rates, isLoading: ratesLoading } = useGetRates();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { mutate: exchange, isLoading: exchangeLoading } = useExchange(() =>
    setShowConfirmationModal(false)
  );
  const [sourceAmount, setSourceAmount] = useState(1);
  const [currentAccount, setcurrentAccount] = useState<{
    source: string | null;
    destination: string | null;
    sourceAccountCurrencyId : string | null
    destinationAccountCurrencyId : string | null
  }>({
    source: "",
    destination: "",
    sourceAccountCurrencyId : "",
    destinationAccountCurrencyId : ""
  });

  const accountOptions = useMemo(() => {
  return (
    userAccounts?.data
      .map((fxAccount) => ({
        label: fxAccount.label,
        value: fxAccount.id.toString(),
        currencyId: fxAccount.currency.id.toString(),
      })) ?? []
  );
}, [userAccounts]);

  useEffect(
    function () {
      const source = accountOptions[0]?.value;
      const destination = accountOptions[1]?.value;
      const sourceAccountCurrencyId = accountOptions[0]?.currencyId;
      const destinationAccountCurrencyId = accountOptions[1]?.currencyId;
      setcurrentAccount({
        source,
        destination,
        sourceAccountCurrencyId,
        destinationAccountCurrencyId,
      });
    },
    [accountOptions, accountOptions.length]
  );



  const matchedRate = useCallback(
    function () {
      const rate = rates?.data
        .filter((rate) => rate.is_active)
        .find(function (rate) {
          return (
            true
          );
        });
      return rate;
    },
    [currentAccount.destination, currentAccount.source, rates?.data]
  );

  const rateFactor = matchedRate()?.rate || 1;
  const destinationAmount = sourceAmount * Number(rateFactor);

  function getCurrencyNameFromId(id: string | null) {
    const currency = currencyOptionsWithId.find(
      (currency) => currency.value === id
    );
    return currency?.label;
  }

  function handleExchangeClick() {
    if (sourceAmount < 1) {
      return showNotification({
        title: "Error",
        message: `You have entered an invalid amount`,
        color: "red",
      });
    }
    setShowConfirmationModal(true);
  }

  function handleExchange() {
    if (currentAccount.destination !== null && currentAccount.source !== null) {
      exchange({
        amount: sourceAmount.toString(),
        destination_account: parseInt(currentAccount.destination) as number,
        source_account: parseInt(currentAccount.source) as number,
      });
    }
  }

  const rate = matchedRate()?.rate;
  return (
    <div className="bg-gray-30 border rounded-lg p-4">
      <Skeleton visible={currenciesLoading || ratesLoading}>
        <section className="bg-white p-4 rounded border flex gap-4">
          <Select
            className="flex-grow"
            label="Source Account"
            value={currentAccount.source}
            onChange={(value) => {
              console.log(value)
              const accountCurrencyId = accountOptions.find((account) => account.value === value)?.currencyId
              setcurrentAccount({
                ...currentAccount,
                source: value,
                sourceAccountCurrencyId: accountCurrencyId || null
              });
            }}
            data={accountOptions}
            nothingFound={"No currencies found"}
          />
          <NumberInput
            className="flex-grow"
            label="You send"
            value={sourceAmount}
            onChange={(value) => setSourceAmount(value as number)}
            precision={2}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : ""
            }
            min={1}
          />
        </section>
        <section className="h-24 flex items-center justify-center relative">
          <div className="absolute h-full w-5 bg-white mx-auto"></div>
          <div className="relative h-10 aspect-square rounded-full bg-white flex items-center justify-center">
            <ConvertIcon />
          </div>
        </section>
        <section className="bg-white p-4 rounded border flex gap-4">
          <Select
            className="flex-grow"
            label="Destination Account"
            value={currentAccount.destination}
            onChange={(value) => {
              const accountCurrencyId = accountOptions.find((account) => account.value === value)?.currencyId
              setcurrentAccount({
                ...currentAccount,
                destination: value,
                destinationAccountCurrencyId: accountCurrencyId || null
              });
            }}
            data={accountOptions}
          />
          <NumberInput
            className="flex-grow"
            label="You receive"
            disabled
            //   parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : ""
            }
            value={destinationAmount}
          />
        </section>

        <div className="text-primary-70 text-center my-5 text-sm">
          <span className="font-semibold">Market Rate:</span> 1{" "}
          {getCurrencyNameFromId(currentAccount.source)} ={" "}
          {matchedRate()?.rate || "[Not set]"}{" "}
          {getCurrencyNameFromId(currentAccount.destination)}
        </div>
        <Button
          disabled={!rate}
          className="bg-accent hover:bg-accent"
          size="md"
          fullWidth
          onClick={handleExchangeClick}
        >
          Exchange
        </Button>

        {!matchedRate()?.rate && (
          <div className="text-red-600 font-medium font-secondary text-sm text-center mt-1">
            Rate not set for selected pair
          </div>
        )}
      </Skeleton>

      <Modal
        opened={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
      >
        <Stack align="center" className="w-full">
          <Warning2 size={60} />
          <div className="text-center">
            Are you sure you want to request to exchange{" "}
            <span className="font-medium">
              {currencyFormatter(sourceAmount)}{" "}
            </span>
            {getCurrencyNameFromId(currentAccount.source)} for{" "}
            <span className="font-medium">
              {currencyFormatter(destinationAmount)}{" "}
            </span>{" "}
            {getCurrencyNameFromId(currentAccount.destination)}
          </div>

          <Group grow className="w-full">
            <Button
              className="bg-white hover:bg-white text-red-600 border-1 border-red-600"
              onClick={() => setShowConfirmationModal(false)}
              size="md"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary-100 hover:bg-primary-100"
              loading={exchangeLoading}
              onClick={handleExchange}
              size="md"
            >
              Yes, Proceed
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
