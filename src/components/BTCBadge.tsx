import { useEffect, useState } from "react";
// import "./assets/main.css"; // Adjust path if needed

interface CryptoCompareResponse {
  RAW: {
    BTC: {
      USD: {
        OPEN24HOUR: number;
        PRICE: number;
      };
    };
  };
}

function BTCBadge() {
  const [btcUSD, setBtcUSD] = useState<number>(0.0);
  const [percentChange, setPercentChange] = useState<number>(0);
  const [upDown, setUpDown] = useState<"up" | "down">("up");

  useEffect(() => {
    getInfo();
    const interval = setInterval(() => {
      getInfo();
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  const getPercentChange = (newPrice: number, open: number) => {
    const change = ((newPrice - open) / open) * 100;
    setPercentChange(parseFloat(change.toFixed(4)));
    setUpDown(newPrice > open ? "up" : "down");
  };

  const getInfo = async () => {
    try {
      const response = await fetch(
        "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH&tsyms=USD&e=Coinbase"
      );
      const data: CryptoCompareResponse = await response.json();
      const open = data.RAW.BTC.USD.OPEN24HOUR;
      const newPrice = data.RAW.BTC.USD.PRICE;
      console.log(open);
      getPercentChange(newPrice, open);
      setBtcUSD(newPrice);
    } catch (error) {
      console.error("Error fetching BTC data:", error);
    }
  };

  return (
    <div className='btc-badge text-gray-50'>
      <main className='h-screen w-screen flex flex-col items-center justify-center'>
        <div className='flex flex-col items-left'>
          <h1 className='mb-4 text-xs'>Bitcoin-Current-Price</h1>
          <p className='mb-4 text-[16vw]'>${btcUSD.toFixed(2)}</p>
          <h2 className='mb-4 text-xs'>Past 24 hours</h2>
          <p className={`text-[8vw] ${upDown}`}>{percentChange.toFixed(4)}%</p>
        </div>
      </main>
    </div>
  );
}

export default BTCBadge;
