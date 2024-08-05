import { useEffect, useState } from "react"
import StripeCheckout from 'react-stripe-checkout'
import useRequest from "../../hooks/useRequest"

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: (payment) => console.log(payment)
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }
    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)

    return () => clearInterval(timerId)
  },[])

  if(timeLeft < 0) {
    return <div>Order Expired</div>
  }


  return (
    <div>
        <div>Time left to pay: {timeLeft} seconds</div>
        <StripeCheckout
          token={({ id }) => doRequest({ token: id })}
          stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY}
          amount={order.ticket.price * 100}
          email={currentUser.email}
         />
         {errors}
        <h1>{order.ticket.title}</h1>
        <h4>{order.status}</h4>
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query
    const { data } = await client.get(`/api/orders/${orderId}`)

    return { order: data }
}

export default OrderShow