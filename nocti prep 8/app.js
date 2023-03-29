const express = require('express')
const app = express()

app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs')

class Item {
    constructor(name,qty,unitPrice) {
        this.name = name
        this.qty = qty
        this.unitPrice = unitPrice
        this.profit = unitPrice * 0.40
        this.retailPrice = this.profit + unitPrice
        this.subtotal = this.retailPrice*qty
        this.salesTax = this.subtotal*0.6
    }
}

function round(value) { 
value *= 100
value = Math.round(value)
value /= 100
return value
}

var orders = []

app.get('/',(req,res) => {res.render("index.ejs")})

app.get('/vieworders',(req,res) => {res.render('vieworders',{orders: orders})})

app.post('/createorder',(req,res) => {
    let order = {
    items:[],
    name: req.body.customerName,
    address: req.body.customerAddress,
    date: new Date,
    subtotal:0,
    salesTax:0,
    profit:0,
    shipping:0,
    total:0
    }

if (req.body.CRV)order.items.push(new Item('Honda CRV',req.body.CRV,13000.00))
if (req.body.Element)order.items.push(new Item('Honda Element',req.body.Element,42000.00))
if (req.body.Caliber)order.items.push(new Item('Dodge Caliber',req.body.Caliber,120.00))

for (const item of order.items) {
item.subtotal = round(item.subtotal)
item.salesTax = round(item.salesTax)
item.profit = round(item.profit)
item.retailPrice = round(item.retailPrice)

order.subtotal += item.subtotal
order.salesTax += item.salesTax
order.retailPrice += item.retailPrice
order.profit = round(order.salesTax)
order.salesTax = round(order.salesTax)
}

if (order.subtotal < 40) order.shipping = 15
else if (order.subtotal < 150) order.shipping = 10

orders.push(order)
res.redirect('/vieworders')
})

app.listen(6969,(req,res) => {console.log(`server on 6969`);})


