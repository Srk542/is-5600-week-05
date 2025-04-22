const cuid = require('cuid')
const db = require('./db')

const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  buyerEmail: { type: String, required: true },
  products: [{
    type: String,
    ref: 'Product',
    required: true,
    index: true
  }],
  status: {
    type: String,
    index: true,
    default: 'CREATED',
    enum: ['CREATED', 'PENDING', 'COMPLETED']
  }
})

async function list({ offset = 0, limit = 25, productId, status } = {}) {
  const query = {
    ...(productId && { products: productId }),
    ...(status && { status })
  }

  const orders = await Order.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)

  return orders
}

async function get(_id) {
  return await Order.findById(_id).populate('products').exec()
}

async function create(fields) {
  const order = await new Order(fields).save()
  await order.populate('products')
  return order
}

async function edit(_id, change) {
  const order = await get(_id)
  Object.assign(order, change)
  await order.save()
  return order
}

async function destroy(_id) {
  return await Order.deleteOne({ _id })
}

module.exports = {
  list,
  get,
  create,
  edit,
  destroy
}
