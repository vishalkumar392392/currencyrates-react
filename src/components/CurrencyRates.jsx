import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrencyRates } from "../redux/CurrencyRates/currencyRateSlice";
import styles from "./CurrencyRates.module.css";
import DataTable from "./DataTable/DataTable";

const COLUMNS = [
  { key: "currencyDescription", label: "Currency Description" },
  { key: "calculatorIndicator", label: "Calculator Indicator" },
  { key: "nabancoMerchantRate", label: "Nabanco / Merchant Rate" },
  { key: "cashBuyRate", label: "Cash Buy Rate" },
  { key: "cashSellRate", label: "Cash Sell Rate" },
  { key: "chequeBuyRate", label: "Cheque Buy Rate" },
  { key: "chequeSellRate", label: "Cheque Sell Rate" },
  { key: "cashBuySettlementRate", label: "Cash Buy Settlement Rate" },
  { key: "cashSellSettlementRate", label: "Cash Sell Settlement Rate" },
  { key: "chequeBuySettlementRate", label: "Cheque Buy Settlement Rate" },
  { key: "chequeSellSettlementRate", label: "Cheque Sell Settlement Rate" },
];

function CurrencyRates() {
  const dispatch = useDispatch();
  const { currencyRates, loading, error } = useSelector(
    (state) => state.currencyRates,
  );

  useEffect(() => {
    dispatch(fetchCurrencyRates());
  }, [dispatch]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {String(error)}</div>;

  return (
    <DataTable
      columns={COLUMNS}
      data={currencyRates}
      pageSizeOptions={[10, 25, 50]}
    />
  );
}

export default CurrencyRates;
