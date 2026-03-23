import { Suspense } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import CurrencyRates from "./components/CurrencyRates";

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
