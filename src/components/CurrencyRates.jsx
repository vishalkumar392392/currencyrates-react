import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCurrencyRates } from "../redux/CurrencyRates/currencyRateSlice";
import {
  StatusMessage,
  ActionBar,
  PrintBtn,
  OkBtn,
  SuccessBanner,
  BannerText,
  BannerClose,
  ScreenOnly,
  PrintOnly,
  PrintTable,
} from "./DataTable/DataTable.styles";
import DataTable from "./DataTable/DataTable";

const COLUMNS = [
  { key: "currencyDescription", label: "Currency Description", sortable: true },
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
  const navigate = useNavigate();
  const { currencyRates, loading, error } = useSelector(
    (state) => state.currencyRates,
  );
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrencyRates());
  }, [dispatch]);

  const handlePrint = () => {
    window.print();
    setShowSuccess(true);
  };

  const handleOk = () => {
    navigate(-1);
  };

  if (loading) return <StatusMessage>Loading...</StatusMessage>;
  if (error) return <StatusMessage $error>Error: {String(error)}</StatusMessage>;

  return (
    <div>
      <ScreenOnly>
        {showSuccess && (
          <SuccessBanner>
            <BannerText>
              <strong>&#10003; Successful!</strong>
              <span>List of Foreign exchange rate file was printed.</span>
            </BannerText>
            <BannerClose onClick={() => setShowSuccess(false)}>&#x2715;</BannerClose>
          </SuccessBanner>
        )}

        <DataTable
          columns={COLUMNS}
          data={currencyRates}
          pageSizeOptions={[10, 25, 50]}
        />

        <ActionBar>
          <PrintBtn onClick={handlePrint}>Print</PrintBtn>
          <OkBtn onClick={handleOk}>OK</OkBtn>
        </ActionBar>
      </ScreenOnly>

      <PrintOnly>
        <PrintTable>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currencyRates.map((row, i) => (
              <tr key={row.id ?? i}>
                {COLUMNS.map((col) => (
                  <td key={col.key}>{row[col.key] ?? '-'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </PrintTable>
      </PrintOnly>
    </div>
  );
}

export default CurrencyRates;
