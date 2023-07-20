import { Form, redirect } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import { useNavigation } from "react-router-dom";
import { useActionData } from "react-router-dom";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from '../../store';
import { clearCart } from "../cart/cartSlice";
import { formatCurrency } from "../../utilities/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );


function CreateOrder() {

  const dispatch = useDispatch();

 

  const {
    username, 
    status: addressStatus, 
    position, 
    address,
    error : errorAddress
  } = useSelector((state) => state.user);

  const isLoadingAddress = addressStatus === 'loading'; 


  const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;


  const totalPrice = totalCartPrice + priorityPrice;

  
  
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting";
  
  
  
  const formErrors = useActionData();

  if(!cart.length) return <EmptyCart/>

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-8 ">Ready to order? Lets go!</h2>

      

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center ">
          <label className="sm:basis-40">First Name</label>
          <input 
          type="text" 
          name="customer" 
          defaultValue={username}
          required 
          className="input grow"
          />
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center ">
          <label className="sm:basis-40">Phone Number</label>
          <div className="grow">
            <input 
            type="tel" 
            name="phone" 
            required
            className="input w-full" />
            {
            formErrors?.phone && <p className="text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-md">{formErrors.phone}</p>
          }
          </div>
          
        </div>
        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center relative ">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input 
            className="input w-full"
            type="text" 
            name="address" 
            defaultValue={address}
            disabled={isLoadingAddress}
            required
            />
            {
            addressStatus === 'error' && <p className="text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-md">{errorAddress}</p>
          }
          </div>


          {
            !position.latitude && !position.longitude &&
          <span className="absolute right-[3px] z-50 top-[3px] md:right-[5px] md:top-[5px]">
          <Button
          disabled = {isLoadingAddress} 
          type="small" 
          onClick={(e) => {
            e.preventDefault();
            dispatch(fetchAddress())}}>Get Position</Button>
          </span>}
          
        </div>
        <div className="mb-12 flex gap-5 items-center ">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">Want to give your order priority?</label>
        </div>
        <div>
          <input 
          type="hidden" 
          name="cart" 
          value={JSON.stringify(cart)}
          />
          <input
          type="hidden"
          name='position'
          value={position.longitude && position.longitude ? `${position.latitute}, ${position.longitude}`: ''}

          />
          
          <Button disabled={ isSubmitting || isLoadingAddress } type="primary">{ isSubmitting ? 'Pacing order....':  `Order now from ${formatCurrency(totalPrice)}` }</Button>
        </div>
      </Form>
    </div>
  );
}
 
export async function action({request}){
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
 


  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  
  const errors = {};
  if(!isValidPhone(order.phone)) 
    errors.phone = 'Please give us your correct phone number we might need to contact you.';
  if(Object.keys(errors).length > 0 )  return errors;  
  // if everything is ok create order or redirect 
  const newOrder = await createOrder(order);

  // Do Not Over use 
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
