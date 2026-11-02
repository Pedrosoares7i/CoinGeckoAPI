import CoinCard from './CoinCard.jsx';

export default function CoinList({ coins, currency, onSelect }) {
  return (
    <section className="coin-grid" aria-label="Lista de criptomoedas">
      {coins.map((coin) => (
        <CoinCard key={coin.id} coin={coin} currency={currency} onSelect={onSelect} />
      ))}
    </section>
  );
}
