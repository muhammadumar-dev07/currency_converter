import { useState } from "react";
import axios from "axios";

const CURRENCIES = [
    { c: "USD", n: "US Dollar" }, { c: "EUR", n: "Euro" }, { c: "GBP", n: "British Pound" }, { c: "PKR", n: "Pakistani Rupee" },
    { c: "INR", n: "Indian Rupee" }, { c: "AED", n: "UAE Dirham" }, { c: "SAR", n: "Saudi Riyal" }, { c: "CAD", n: "Canadian Dollar" },
    { c: "AUD", n: "Australian Dollar" }, { c: "JPY", n: "Japanese Yen" }, { c: "CNY", n: "Chinese Yuan" }, { c: "CHF", n: "Swiss Franc" },
    { c: "NZD", n: "New Zealand Dollar" }, { c: "TRY", n: "Turkish Lira" }, { c: "MYR", n: "Malaysian Ringgit" }, { c: "SGD", n: "Singapore Dollar" },
    { c: "SEK", n: "Swedish Krona" }, { c: "NOK", n: "Norwegian Krone" }, { c: "DKK", n: "Danish Krone" }, { c: "ZAR", n: "South African Rand" }
];

export default function Converter() {
    const [amount, setAmount] = useState("100");
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("PKR");
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [exchangeRate, setExchangeRate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setConvertedAmount(null);
        setExchangeRate(null);
        setError(null);
    };

    const handleConvert = async (e) => {
        e.preventDefault();
        setError(null);
        setConvertedAmount(null);
        setExchangeRate(null);

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError("Please enter a valid amount greater than 0.");
            return;
        }

        setLoading(true);

        try {
            const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
            const res = await axios.get("https://v6.exchangerate-api.com/v6/" + apiKey + "/pair/" + fromCurrency + "/" + toCurrency + "/" + numAmount);

            if (res.data.result === "success") {
                setConvertedAmount(res.data.conversion_result);
                setExchangeRate(res.data.conversion_rate);
            } else {
                setError("Unable to convert currency. Please try again.");
            }
        } catch {
            setError("Unable to convert currency. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-black text-center mb-6">Currency Converter</h1>

                <form onSubmit={handleConvert} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            step="any"
                            min="0.000001"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3 items-center">
                        <div>
                            <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 mb-1">From</label>
                            <select
                                id="fromCurrency"
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                            >
                                {CURRENCIES.map((x) => (
                                    <option key={x.c} value={x.c}>{x.c} - {x.n}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-center sm:pt-6">
                            <button
                                type="button"
                                onClick={handleSwap}
                                title="Swap"
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition cursor-pointer text-sm font-medium"
                            >
                                Swap
                            </button>
                        </div>

                        <div>
                            <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                            <select
                                id="toCurrency"
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                            >
                                {CURRENCIES.map((x) => (
                                    <option key={x.c} value={x.c}>{x.c} - {x.n}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Converting..." : "Convert"}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                        {error}
                    </div>
                )}

                {convertedAmount !== null && exchangeRate !== null && (
                    <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center space-y-2">
                        <div className="text-xl font-bold text-gray-900">
                            {Number(amount).toLocaleString()} {fromCurrency} = {Number(convertedAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
                        </div>
                        <div className="text-sm text-gray-600">
                            1 {fromCurrency} = {exchangeRate} {toCurrency}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
