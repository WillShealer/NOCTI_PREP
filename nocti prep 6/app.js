const express = require('express')
const app = express()

app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs')

class Item {
    constructor(name,qty,unitPrice) {
        this.name = name
        this.qty = round(qty)
        this.unitPrice = unitPrice
        this.profit = unitPrice *0.40
        this.retailPrice = this.profit + unitPrice
        this.subtotal = this.retailPrice *qty
        this.salesTax = this.subtotal * 0.6
    }
}

function round(value) {
    value *= 100
    value = Math.round(value)
    value /= 100
    return value
}

var orders = []

app.get('/', (req,res) => {res.render("index.ejs")})

app.get('/vieworders', (req,res) => {res.render("vieworders.ejs", {orders:orders})})

app.post('/createorder',(req,res) => {
let order = {
items: [],
name: req.body.customerName,
address: req.body.customerName,
date: new Date,
subtotal:0,
salesTax:0,
profit:0,
shipping:0,
total:0
}

if (req.body.sus)order.items.push(new Item('sus', req.body.sus,420))
if (req.body.suss)order.items.push(new Item('suss', req.body.suss,420))
if (req.body.susss)order.items.push(new Item('susss', req.body.susss,420))

for (const item of order.items) {
    item.subtotal = round(item.subtotal)
    item.salesTax = round(item.salesTax)
    item.retailPrice = round(item.retailPrice)
    item.profit = round(item.profit)

    order.subtotal += item.subtotal
    order.salesTax += item.salesTax
    order.retailPrice += item.retailPrice
    order.profit = round(order.profit)
    order.salesTax = round(order.salesTax)
}

if (order.subtotal < 40) order.shipping = 15
else if (order.subtotal < 150) order.shipping = 10

order.total = order.subtotal + order.salesTax + order.shipping
order.total = round(order.total)

orders.push(order)
res.redirect('/vieworders')
})

app.listen(6969, (req,res) => {console.log(`the server is on port 6969`);})