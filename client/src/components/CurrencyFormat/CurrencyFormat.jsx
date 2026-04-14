import Numeral from 'numeral';
const CurrencyFormat = ({ amount }) => {
    const formattedAmount = Numeral(amount).format('$0,0.00');
    return <span>{formattedAmount}</span>;
}
export default CurrencyFormat;