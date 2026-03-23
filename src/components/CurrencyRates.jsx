import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrencyRates } from '../redux/CurrencyRates/currencyRateSlice';
import styles from './CurrencyRates.module.css';

const COLUMNS = [
  { key: 'currencyDescription',      label: 'Currency Description' },
  { key: 'calculatorIndicator',      label: 'Calculator Indicator' },
  { key: 'nabancoMerchantRate',      label: 'Nabanco / Merchant Rate' },
  { key: 'cashBuyRate',              label: 'Cash Buy Rate' },
  { key: 'cashSellRate',             label: 'Cash Sell Rate' },
  { key: 'chequeBuyRate',            label: 'Cheque Buy Rate' },
  { key: 'chequeSellRate',           label: 'Cheque Sell Rate' },
  { key: 'cashBuySettlementRate',    label: 'Cash Buy Settlement Rate' },
  { key: 'cashSellSettlementRate',   label: 'Cash Sell Settlement Rate' },
  { key: 'chequeBuySettlementRate',  label: 'Cheque Buy Settlement Rate' },
  { key: 'chequeSellSettlementRate', label: 'Cheque Sell Settlement Rate' },
];

function CurrencyRateTable({ data }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id ?? index} className={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              {COLUMNS.map((col) => {
                const value = row[col.key] ?? '-';
                return (
                  <td key={col.key}>
                    <span className={styles.tooltipWrapper}>
                      {value}
                      <span className={styles.tooltipBox}>{value}</span>
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CurrencyRates() {
  const dispatch = useDispatch();
  const { currencyRates, loading, error } = useSelector((state) => state.currencyRates);

  useEffect(() => {
    dispatch(fetchCurrencyRates());
  }, [dispatch]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error)   return <div className={styles.error}>Error: {String(error)}</div>;

  return (
    <div className={styles.container}>
      <CurrencyRateTable data={currencyRates} />
    </div>
  );
}

export default CurrencyRates;
