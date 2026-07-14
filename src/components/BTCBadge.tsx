import { useEffect, useState } from "react";

interface CoinGeckoResponse {
  bitcoin: {
    usd: number;
    usd_24h_change: number;
  };
}

function BTCBadge() {
  const [btcUSD, setBtcUSD] = useState(0);
  const [percentChange, setPercentChange] = useState(0);
  const [upDown, setUpDown] = useState<"up" | "down">("up");

  useEffect(() => {
    getInfo();

    // const interval = setInterval(getInfo, 1000 * 60);
    
    // update every 30 seconds
    const interval = setInterval(getInfo, 30_000);

    // update every 10 seconds
    // const interval = setInterval(getInfo, 10_000);

    return () => clearInterval(interval);
  }, []);

  const getInfo = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
      );

      const data: CoinGeckoResponse = await response.json();

      const price = data.bitcoin.usd;
      const change = data.bitcoin.usd_24h_change;

      setBtcUSD(price);
      setPercentChange(Math.abs(change));
      setUpDown(change >= 0 ? "up" : "down");
    } catch (error) {
      console.error("Error fetching BTC data:", error);
    }
  };

  return (
    <div className="btc-badge text-gray-50">
      <main className="h-screen w-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-start">
          <h1 className="mb-4 text-xs">Bitcoin Current Price</h1>

          <p className="mb-4 text-[16vw]">
            ${btcUSD.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <h2 className="mb-4 text-xs">Past 24 hours</h2>

          <p className={`text-[8vw] ${upDown}`}>
            {upDown === "up" ? "+" : "-"}
            {percentChange.toFixed(4)}%
          </p>
        </div>
      </main>
    </div>
  );
}

export default BTCBadge;