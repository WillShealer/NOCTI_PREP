const express = require('express')

PORT = 6969

const app = express() 
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}))

class Item {
    constructor(name, qty, unitPrice) {
    this.name = name;
    this.qty = qty;
    this.unitPrice = unitPrice;
    this.retailPrice = unitPrice + this.profit;
    this.profit = unitPrice * 0.4;
    this.subtotal = this.retailPrice * qty;
    this.salesTax = this.subtotal * 0.06
    }
}

function round(value) {
    value = value * 100
    value = Math.round(value)
    value /= 100
    return value
}

var orders = []

app.get('/', (req, res) => {
    if (req.query) console.log(req.query);
    if (req.body) console.log(req.body);
    res.render('index')
})

app.get('/vieworders', (req, res) => {
    res.render('vieworders', {
        orders: orders
    })
})

app.post('/createorder', (req, res) => {
    if (req.body) console.log(req.body);
    let order = {
        items: [],
        name: req.body.customerName,
        address: req.body.customerAddress,
        subtotal:0,
        salesTax:0,
        profit:0,
        shipping:0,
        total:0
    }
    if (req.body.battlepass) order.items.push(new Item('Battlepass', req.body.battlepass, 7.13))
    if (req.body.fnc) order.items.push(new Item('19$ Fortnite Card', req.body.fnc, 14.28))
    if (req.body.DLC) order.items.push(new Item("Fortnite DLC", req.body.DLC, 49.78))

     for (const item of order.items) {
        item.subtotal = round(item.subtotal)
        item.subtotal = round(item.retailPrice)
        item.subtotal = round(item.salesTax)
        item.subtotal = round(item.profit)
        order.subtotal += item.subtotal
        order.salesTax += item.salesTax
        order.profit += item.profit
     }
     if (order.subtotal < 40) order.shipping = 15
     else if (order.subtotal < 150) order.shipping = 10

     order.total = order.subtotal + order.salesTax + order.shipping
     order.total = round(order.total)

     orders.push(order)
     res.redirect('/vieworders')
})

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})

