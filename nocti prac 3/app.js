const express = require('express')
const app = express()

PORT = 6969

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))

class Item {
    constructor(name, qty, unitPrice) {
        this.name = name
        this.qty = qty
        this.unitPrice = unitPrice
        this.retailPrice = unitPrice + this.profit
        this.profit = unitPrice * 0.4
        this.subtotal = this.retailPrice * qty
        this.salesTax = this.subtotal * 0.06
    }
}
function round(value) {
    value = value * 100
    value = Math.round(value)
    value /= 100
    return value
}

let orders = []

app.get('/',(req, res) => {
    if (req.query) console.log(req.query);
    if (req.body) console.log(req.body);
    res.render("index")
})

app.get('/vieworders',(req,res) => {
    res.render('vieworders', {
        orders: orders
    })
})

app.post('/createorder',(req,res) => {
    if (req.body) console.log(req.body);
    let order = {
        items: [],
        name: req.body.customerName,
        address: req.body.customerAddress,
        subtotal:0,
        shipping:0,
        salesTax:0,
        profit:0,
        total:0,
    }

    if (req.body.battlepass) order.items.push(new Item('battlepass',req.body.battlepass, 10.99))
    if (req.body.amongus) order.items.push(new Item('amongus',req.body.amongus, 30.99))
    if (req.body.sussy) order.items.push(new Item('sussy',req.body.sussy, 20.99))

    for (const item of order.items) {
        item.subtotal = round(item.subtotal)
        item.subtotal = round(item.retailPrice)
        item.subtotal = round(item.salesTax)
        item.subtotal = round(item.profit)
        order.subtotal += order.subtotal
        order.salesTax += order.subtotal
        order.profit += order.subtotal
    }

    if (order.subtotal < 40 ) order.shipping = 15
    else if (order.subtotal < 150 ) order.shipping = 10

    order.total = order.subtotal = order.salesTax + order.shipping
    order.total = round(order.total)

    order.push(order)
    res.redirect('/vieworders')
})

app.listen(PORT, () => {
    console.log(`started on ${PORT}`);
})