const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({
    extended: true
}))

app.set('view engine', 'ejs')

var orders = []

const retailMarkup = 0.40
const salesTax = 0.06

class Item {
    constructor(name, itemUnitPrice, qty) {
        this.name = name
        this.unit = itemUnitPrice
        this.retail = this.unit * (1 + retailMarkup)
        this.profit = this.retail - this.unit
        this.qty = qty
        this.subtotal = this.retail * this.qty 
        this.salesTax = this.subtotal * salesTax
    }
}
 
app.get('/', (req, res) => {
    res.render('index')
})

app.post('/neworder', (req, res) => {
    let neworder = {
        customerName: req.body.customerName,
        customerAddress: req.body.customerAddress,
        orderDate: new Date(),
        items: []
    }
    neworder.profit = 0
    neworder.subtotal = 0
    neworder.shipping = 0
    neworder.salesTax = 0
    neworder.total = 0

    neworder.items.push(new Item("sussy", 9.99, Number(req.body.item1)))
    neworder.items.push(new Item("sussy2", 99.99, Number(req.body.item2)))
    neworder.items.push(new Item("sussy3", 999.99, Number(req.body.item3)))

    for (var item of neworder.items) {
        neworder.subtotal += item.subtotal
        neworder.salesTax += item.salesTax
        neworder.profit += item.profit
    }

if (neworder.subtotal < 40) neworder.shipping = 15
else if (neworder.subtotal < 150) neworder.shipping = 10

neworder.profit = neworder.profit
neworder.subtotal = neworder.subtotal
neworder.shipping = neworder.shipping
neworder.salesTax = neworder.salesTax
neworder.shipping = neworder.shipping

neworder.total = neworder.subtotal + neworder.shipping + neworder.salesTax + neworder.shipping

orders.push(neworder)

res.redirect('/report')
})

app.get("/report", (req, res) => {
    res.render('report', {
        orders: orders
    })
})

app.listen(6969, () => {
    console.log('listening on port 6969')
})