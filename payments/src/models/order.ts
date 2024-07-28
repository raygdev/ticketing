import mongoose, { version } from "mongoose";
import { OrderStatus } from "@raygdevtickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  id: string
  status: OrderStatus
  price: number
  version: number
  userId: string
}

interface OrderDoc extends mongoose.Document {
  version: number
  userId: string
  price: number
  status: OrderStatus
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus)
    }
},{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        userId: attrs.userId,
        status: attrs.status,
        price: attrs.price
    })
}

const Order = mongoose.model<OrderDoc, OrderModel>('orders', orderSchema)

export { Order }