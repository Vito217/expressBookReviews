const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Customer requests will have the session parameter
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// Every URL under /customer/auth requieres authentication
app.use("/customer/auth/*", function auth(req,res,next){

    // We check if req.session parameter needs authorization
    if (req.session)
    {
        if (req.session.authorization) {
            let token = req.session.authorization['accessToken'];
    
            // Verify JWT token
            jwt.verify(token, "access", (err, user) => {
                if (!err) {
                    req.user = user;
                    next();
                } else {
                    return res.status(403).json({ message: "User not authenticated" });
                }
            });
        } else {
            return res.status(403).json({ message: "User not logged in" });
        }
    }
    else{
        return res.status(403).json({ message: "Session not detected" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
