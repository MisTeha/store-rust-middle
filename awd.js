// const axios = require('axios');

// axios.post('132.145.237.25/rust/vip/', {
//     firstName: 'Finn',
//     lastName: 'Williams'
// });

// axios.get('github.com').then(response => {
//     console.log(response);
// })
let p = {}
p.body = { "id": 477, "parent_id": 0, "status": "pending", "currency": "EUR", "version": "7.2.0", "prices_include_tax": false, "date_created": "2022-12-24T19:04:13", "date_modified": "2022-12-25T12:49:04", "discount_total": "0.00", "discount_tax": "0.00", "shipping_total": "0.00", "shipping_tax": "0.00", "cart_tax": "0.00", "total": "3.50", "total_tax": "0.00", "customer_id": 0, "order_key": "wc_order_tFHKxzgkYtCbz", "billing": { "first_name": "", "last_name": "", "company": "", "address_1": "", "address_2": "", "city": "", "state": "", "postcode": "", "country": "", "email": "", "phone": "" }, "shipping": { "first_name": "", "last_name": "", "company": "", "address_1": "", "address_2": "", "city": "", "state": "", "postcode": "", "country": "", "phone": "" }, "payment_method": "", "payment_method_title": "", "transaction_id": "", "customer_ip_address": "", "customer_user_agent": "", "created_via": "admin", "customer_note": "", "date_completed": null, "date_paid": "2022-12-24T20:00:58", "cart_hash": "", "number": "477", "meta_data": [{ "id": 860, "key": "discord", "value": "ukp123#8619" }, { "id": 862, "key": "discord", "value": "ukp123#8619" }, { "id": 863, "key": "steam", "value": "76561198142484741" }], "line_items": [{ "id": 11, "name": "VIP 7 Päeva", "product_id": 368, "variation_id": 0, "quantity": 1, "tax_class": "", "subtotal": "3.50", "subtotal_tax": "0.00", "total": "3.50", "total_tax": "0.00", "taxes": [], "meta_data": [], "sku": "", "price": 3.5, "image": { "id": "66", "src": "https://estoniarust.ee/wp-content/uploads/2022/11/7_Days_VIP.png" }, "parent_name": null }], "tax_lines": [], "shipping_lines": [], "fee_lines": [], "coupon_lines": [], "refunds": [], "payment_url": "https://estoniarust.ee/index.php/checkout/order-pay/477/?pay_for_order=true&key=wc_order_tFHKxzgkYtCbz", "is_editable": true, "needs_payment": true, "needs_processing": true, "date_created_gmt": "2022-12-24T19:04:13", "date_modified_gmt": "2022-12-25T12:49:04", "date_completed_gmt": null, "date_paid_gmt": "2022-12-24T20:00:58", "currency_symbol": "€", "_links": { "self": [{ "href": "https://estoniarust.ee/index.php/wp-json/wc/v3/orders/477" }], "collection": [{ "href": "https://estoniarust.ee/index.php/wp-json/wc/v3/orders" }] } }
const express = require('express');

const crypto = require('crypto');

const app = express();

async function hmacSha256(secret, message) {
    const enc = new TextEncoder("utf-8");
    const algorithm = { name: "HMAC", hash: "SHA-256" };
    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        algorithm,
        false, ["sign", "verify"]
    );
    const hashBuffer = await crypto.subtle.sign(
        algorithm.name,
        key,
        enc.encode(message)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(
        b => b.toString(16).padStart(2, '0')
    ).join('');
    const ans = Buffer.from(hashHex, 'hex').toString('base64')
    return ans;
}

async function tere(req, res) {
    console.log('\n' + JSON.stringify(req.body));
    const { meta_data, line_items } = req.body;
    let discordTag, steamIDString, steamid;
    for (const field of meta_data) {
        if (field.key === "discord") { discordTag = field.value; }
        if (field.key === "steam") { steamIDString = field.value; }
    }
    let q = 0;
    for (const item of line_items) {
        let a;
        if (item.name.includes('7')) { a = 7; }
        else if (item.name.includes('14')) { a = 14; }
        else if (item.name.includes('30')) { a = 30; }
        q += a * item.quantity;
    }
    var re = new RegExp('\\d{17}');
    var r = steamIDString.match(re);
    if (r)
        console.log(r[0]); else
        console.warn(`ei sobi ${steamIDString}`);
    steamid = r[0]
    console.log('');
    console.log(`${steamid} ${discordTag} ${q}`);
    res.sendStatus(200);
}

app.use(express.json());
app.post('/rust/vip', (req, res) => {
    console.log('\n' + JSON.stringify(req.body));
    const { meta_data, line_items } = req.body;
    let discordTag, steamIDString, steamid;
    for (const field of meta_data) {
        if (field.key === "discord") { discordTag = field.value; }
        if (field.key === "steam") { steamIDString = field.value; }
    }
    let q = 0;
    for (const item of line_items) {
        let a;
        if (item.name.includes('7')) { a = 7; }
        else if (item.name.includes('14')) { a = 14; }
        else if (item.name.includes('30')) { a = 30; }
        q += a * item.quantity;
    }
    var re = new RegExp('\\d{17}');
    var r = steamIDString.match(re);
    if (r)
        console.log(r[0]); else
        console.warn(`ei sobi ${steamIDString}`);
    steamid = r[0]
    console.log('');
    console.log(`${steamid} ${discordTag} ${q}`);
    res.sendStatus(200);
});

app.listen(80, () => {
    console.log('listening on port 80')
})