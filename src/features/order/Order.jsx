// Test ID: IIDSAT
import OrderItem from './OrderItem'
import { useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import { useFetcher } from 'react-router-dom';
import { useEffect } from 'react';

import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utilities/helpers";
import UpdateOrder from './UpdateOrder';
//  import { calcMinutesLeft,formatCurrency, formatDate, } from '.../utilities/helpers';

//
function Order() {

  const order = useLoaderData();

  const fetcher = useFetcher();


  useEffect(function(){
    if(!fetcher.data && fetcher.state === 'idle')
    fetcher.load('/menu')
  },[fetcher]);
  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="py-6 px-6 space-y-8 ">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-semibold">Order #{id} status</h2>

        <div className="space-x-2">
          {priority && <span className="bg-red-400 rounded-full text-red-50 text-small uppercase font-semibold tracking-wide px-3 py-1">Priority</span>}
          <span className="bg-green-400 rounded-full text-red-50 text-small uppercase font-semibold tracking-wide px-3 py-1">{status} order</span>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 bg-stone-200 py-5 px-6">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-xs text-stone-500">(Estimated delivery: {formatDate(estimatedDelivery)})</p>
      </div>

      <ul className="dive-stone-200 divide-y border-b border-t">
        {
          cart.map(item => <OrderItem item={item} key={item.id} isLoadingIngredients={fetcher.state === 'loading'} ingredients={fetcher?.data?.find(el => el.id === item.pizzaId).ingredients ?? []}  />)
        }
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && <p className="text-sm font-medium text-stone-600">Price priority: {formatCurrency(priorityPrice)}</p>}
        <p className="font-bold">To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
      </div>

     { 
     !priority &&
     <UpdateOrder order={order}/>}
    </div>
  );
}


export async function loader({params}){
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;
