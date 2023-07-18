import { Form, redirect } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import { useNavigation } from "react-router-dom";
import { useActionData } from "react-router-dom";
import Button from "../../ui/Button";
import { useSelector } from "react-redux";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

  
const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {

  const username = useSelector((state) => state.user.username);

  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting";
  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  const formErrors = useActionData();

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-8 ">Ready to order? Lets go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST" >

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
        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center ">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input 
            type="text" 
            name="address" 
            required
            className="input w-full"
            />
          </div>
        </div>
        <div className="mb-12 flex gap-5 items-center ">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">Want to give your order priority?</label>
        </div>
        <div>
          <input 
          type="hidden" 
          name="cart" 
          value={JSON.stringify(cart)}
          />
          {/* <button 
          disabled={isSubmitting} 
          className="bg-yellow-400 uppercase font-semibold text-stone-800 py-3 px-4 inline-block tracking-wide rounded-full hover:bg-yellow-300 transition-colors duration-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:bg-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed ">{ isSubmitting ? 'Pacing order....':  'Order now' }</button>  */}
          <Button disabled={isSubmitting} type="primary">{ isSubmitting ? 'Pacing order....':  'Order now' }</Button>
        </div>
      </Form>
    </div>
  );
}
 
export async function action({request}){
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(formData);
  console.log(data);
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
  };
  const errors = {};
  if(!isValidPhone(order.phone)) 
    errors.phone = 'Please give us your correct phone number we might need to contact you.';
  if(Object.keys(errors).length > 0 )  return errors;  
  // if everything is ok create order or redirect 
  const newOrder = await createOrder(order);

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
