const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const dotenv = require("dotenv");
const stripe = require("stripe")

//Starting the server
const app = express();

//Load variables
dotenv.config();


app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req,res)
{
    res.sendFile(__dirname + "/signup.html");
});

app.get("/shopping_cart.html", function(req,res)
{
    res.sendFile(__dirname+"/shopping_cart.html");
})

app.post("/", function(req,res)
{
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.Email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us22.api.mailchimp.com/3.0/lists/42b70ecc5c";

    const options = {
        method: "POST",
        auth: "shekar28:c4f9d3050a32cd384a19c7552b1dc63c-us22"
    }

    const request = https.request(url, options, function(response)
    {
        if( response.statusCode == 200) {
           res.sendFile(__dirname+"/amazon_homepage.html"); 
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data)
    {
        console.log(JSON.parse(data));
    })
    });

    request.write(jsonData);
    request.end();
});




// app.post("/", function(req,res)
// {
//     res.send("Application Working Fine!!!!!!!");
// });

//Success
// app.get("/", function(req,res)
// {
//     res.sendFile("success.html");
// });
// //Cancel
// app.get("/", function(req,res)
// {
//     res.sendFile("cancel.html");
// });


// // Stripe
// let stripeGateway = stripe(process.env.stripe_api);
// let DOMAIN = process.env.DOMAIN;
// app.post('/stripe-checkout', async(req, res) =>
// {
//     const lineItems = req.body.items.map((item) => {
//         const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, '') * 100);
//         console.log('item-price:', item.price);
//         console.log('unitAmount:', unitAmount);
//         return {
//             price_data: {
//                 currency: '$',
//                 product_data: {
//                     name: item.title,
//                     images: [item.productImg]
//                 },
//                 unit_amount: unitAmount,
//             },
//             quantity: item.quantity,
//         };
//     });
//     console.log('lineItems:', lineItems);

//     // Create Checkout Session
//     const session = await stripeGateway.checkout.sessions.create({
//         payment_method_type: ['card'],
//         mode: 'payment',
//         success_url: '${DOMAIN}/success',
//         cancel_url: '${DOMAIN}/cancel',
//         line_items: lineItems,

//         //Asking Address In stripe Checkout Page
//         billing_address_collection: 'required'
//     });
//     res.json(session.url);
// });

app.listen(3000, function()
{
    console.log("Server running at port 3000");
});



