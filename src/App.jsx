import { lazy, Suspense } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

const CurrencyRates = lazy(() => import("./components/CurrencyRates"));

function App() {
  return (
    <>
      <Suspense fallback={"Loading.."}>
        <Routes>
          <Route path="/" element={<CurrencyRates />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
