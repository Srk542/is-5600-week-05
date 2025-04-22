const path = require('path')
const Products = require('./products')
const Orders = require('./orders')
const autoCatch = require('./lib/auto-catch')

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query
  res.json(await Products.list({ offset: Number(offset), limit: Number(limit), tag }))
}

async function getProduct(req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)
  if (!product) return next()
  res.json(product)
}

async function createProduct(req, res) {
  const product = await Products.create(req.body)
  res.json(product)
}

async function editProduct(req, res, next) {
  const change = req.body
  const product = await Products.edit(req.params.id, change)
  res.json(product)
}

async function deleteProduct(req, res, next) {
  const response = await Products.destroy(req.params.id)
  res.json(response)
}

async function listOrders(req, res, next) {
  const { offset = 0, limit = 25, productId, status } = req.query
  const orders = await Orders.list({ offset: Number(offset), limit: Number(limit), productId, status })
  res.json(orders)
}

async function createOrder(req, res, next) {
  const order = await Orders.create(req.body)
  res.json(order)
}

async function editOrder(req, res, next) {
  const change = req.body
  const order = await Orders.edit(req.params.id, change)
  res.json(order)
}

async function deleteOrder(req, res, next) {
  const response = await Orders.destroy(req.params.id)
  res.json(response)
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
  createOrder,
  listOrders,
  editOrder,
  deleteOrder
})
