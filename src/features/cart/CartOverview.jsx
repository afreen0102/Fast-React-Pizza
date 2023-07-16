import { Link } from "react-router-dom";

function CartOverview() {
  return (
    <div className="bg-stone-800 text-stone-200 uppercase">
      <p className="text-stone-300 font-semibold">
        <span>23 pizzas</span>
        <span>$23.45</span>
      </p>
      <Link to='/cart'>
        <a href="#">Open cart &rarr;</a>      
      </Link>
      
    </div>
  );
}

export default CartOverview;
