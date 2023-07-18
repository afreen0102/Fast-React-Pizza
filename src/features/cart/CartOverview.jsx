import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
import { formatCurrency } from "../../utilities/helpers";

function CartOverview() {

  const totalCartQuantity = useSelector(getTotalCartQuantity
  );

  const totalCartPrice = useSelector(getTotalCartPrice);

  if(!totalCartQuantity) return null;

  return (
    <div className="bg-stone-800 text-stone-200 uppercase px-4 py-4 sm:px-6 text-sm md:text-base flex items-center justify-between">
      <p className="text-stone-300 font-semibold space-x-4 sm:space-x-6">
        <span>{totalCartQuantity} pizzas</span>
        <span>{formatCurrency(totalCartPrice)}</span>
      </p>
      <Link to='/cart'>
        {/* <a href="#">Open cart &rarr;</a>       */}
        open cart
      </Link>
      
    </div>
  );
}

export default CartOverview;
