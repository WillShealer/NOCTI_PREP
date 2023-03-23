const express = require('express')
const app = express()

app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs')

class Item {
    constructor(name, qty, unitPrice) {
        this.name = name
        this.qty = Number(qty)
        this.unitPrice = unitPrice
        this.profit = unitPrice * 0.4
        this.retailPrice = this.profit + unitPrice
        this.subtotal = this.retailPrice * qty
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

app.get('/', (req, res) => {res.render('index.ejs')})

app.get('/vieworder', (req, res) => {
    res.render('vieworder.ejs', {
        orders: orders
        }
    )
})

app.post('/createorder', (req,res) => {
    let order = {
        items: [],
        name: req.body.customerName,
        address: req.body.customerAddress,
        date: new Date,
        subtotal:0,
        salesTax:0,
        profit:0,
        shipping:0,
        total:0
    }

    if (req.body.mountaindew)order.items.push(new Item("mountain dew",req.body.mountaindew,10.69))
    if (req.body.coke)order.items.push(new Item("coke",req.body.coke,11.69))
    if (req.body.drpepper)order.items.push(new Item("dr pepper",req.body.drpepper,12.69))

    

    for (const item of order.items) {
console.log(item);
        item.subtotal = round(item.subtotal)
        item.salesTax = round(item.salesTax)
        item.retailPrice = round(item.retailPrice)
        item.profit = round(item.profit)

        order.subtotal += item.subtotal
        order.salesTax += item.salesTax
        order.profit += item.profit
        order.profit = round(order.profit)
        order.salesTax = round(order.salesTax)
    }

    if (order.subtotal < 40) order.shipping = 15
    else if (order.subtotal < 150) order.shipping = 10

    order.total = order.subtotal + order.salesTax + order.shipping
    order.total = round(order.total)

    orders.push(order)
    console.log(order)
    res.redirect('/vieworder')
})

app.listen(6969,() => {
    console.log(`server started on 6969`);
})

