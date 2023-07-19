import Button from "../../ui/Button"
import { useDispatch } from "react-redux";
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";
import { getCurrentQuantityById } from "./cartSlice";
import { useSelector } from "react-redux";


const UpdateItemQuantity = ({pizzaId}) => {
  const dispatch = useDispatch();

  const currentquantity = useSelector(getCurrentQuantityById(pizzaId))

  return (
    <div className="flex gap-1 items-center md:gap-3">
      <Button type="round" onClick={() => dispatch(decreaseItemQuantity(pizzaId))}>-</Button>
      <span>{currentquantity}</span>
      <Button type="round" onClick={() => dispatch(increaseItemQuantity(pizzaId))}>+</Button>
    </div>
  )
}

export default UpdateItemQuantity
