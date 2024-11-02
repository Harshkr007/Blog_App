import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

//middleware
import { authentication } from "./middlewares/auth.middleware.js";

//import the routes
import userRoutes from "./routes/user.routes.js"
import staticRoutes from "./routes/static.routes.js"
import blogRoutes from "./routes/blog.routes.js"


const app = express();

// Combine middleware with reduced setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files with EJS view engine
app.use(express.static('public')); 
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));


//routing to routes


app.use("/" ,staticRoutes);

app.use("/user",userRoutes);

app.use("/blog",authentication,blogRoutes);

export default app;

// Add at the end
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Something went wrong!' 
    });
});

//TODO:ERROR PAGE
//TODO:INFO POPUP
