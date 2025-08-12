const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const jwt = require("jsonwebtoken");
require("dotenv").config(); // add this line at the top (only once in your app)
const JWT_SECRET = process.env.JWT_SECRET;// Put this in .env in production


const app = express();
const port = 5000;
 
app.use(cors());
app.use(bodyParser.json());
 


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

 
pool.connect((err) => {
    if (err) {
        console.error("Failed to connect to the database:", err);
    } else {
        console.log("Connected to the PostgreSQL database.");
    }
});



const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid or expired token." });
        }

        req.user = decoded; // Save user info for later use (like user ID/type)

        next();
    });
};

const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.userType.toLowerCase() !== role.toLowerCase()) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Only ${role}s are allowed.`,
            });
        }
        next();

    };
}


 
app.post("/signup", async (req, res) => {
    const { fullName, email, password, phone, userType } = req.body;

    if (!fullName || !email || !password || !phone || !userType) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const result = await pool.query(
            "INSERT INTO users (full_name, email, password, phone, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [fullName, email, password, phone, userType]
        );
        res.status(201).json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error("❌ Error registering user:", err); // <-- key line
        res.status(500).json({
            message: "Error registering user",
            error: err.message, 
    });
}}); 

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.password !== password) {
            return res.status(400).json({ success: false, message: "Invalid password." });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, userType: user.user_type },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        
        const userType = user.user_type.toLowerCase();
        if (userType === "organizer") {
            return res.status(200).json({
                success: true,
                message: "Login successful.",
                userType: "organizer",
                userId: user.id,
                token,
            });
        }
        else if (userType === "customer") {
            return res.status(200).json({
                success: true,
                message: "Customer login successful.",
                token,
                userType: "customer",
                userId: user.id,
            });
        }
        else {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access. Only organizers can log in here.",
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
});

 
app.get("/your-events/", authenticateToken, authorizeRole("organizer"), async (req, res) => {
    const organiserId = req.user.id;
  
    if (isNaN(organiserId)) {
      return res.status(400).json({ success: false, message: "Invalid organizer ID." });
    }
  
    try {
      const result = await pool.query("SELECT * FROM events WHERE organiser_id = $1", [organiserId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: "No events found for this organizer." });
      }
  
      res.status(200).json({ success: true, events: result.rows });
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ success: false, message: "Error fetching events." });
    }
  });
 

const upload = require("./src/middlewares/uploadMiddleware.js");
app.post("/create-event", authenticateToken, authorizeRole("organizer"), upload.single("image"), async (req, res) => {
    const { eventName, eventType, venue, price, date, time, total_tickets } = req.body;
    const booked_tickets = 0;
    const organiserId = req.user.id;
    const imageUrl = req.file ? req.file.path : null;

    const totalTickets = parseInt(total_tickets); // ✅ Important conversion
    const availableTickets = totalTickets;
    console.log("Request body:", req.body);
console.log("Uploaded file:", req.file);


    try {
        const result = await pool.query(
            "INSERT INTO events (event_name, event_type, venue, price, date, time, organiser_id, total_tickets, booked_tickets, available_tickets, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11) RETURNING *",
            [eventName, eventType, venue, price, date, time, organiserId,total_tickets,booked_tickets,availableTickets, imageUrl]
        );
        res.status(201).json({ success: true, event: result.rows[0] });
    } catch (error) {
        console.error("Error creating event:", error);
        console.error(error.stack);  
        res.status(500).json({ success: false, message: "Error creating event." });
    }
});

app.post("/book-event", async (req, res) => {
    const {
      customer_id,
      event_id,
      event_name,
      category,
      event_date,
      event_time,
      location,
      price,
      ticketsToBook,
    } = req.body;
    
    const tickets = parseInt(ticketsToBook, 10);
    
    // Create a client from the pool for transaction
    const client = await pool.connect();

    try {
        console.log("Booking event_id:", event_id);

        if (!tickets || isNaN(tickets) || tickets < 1) {
            console.log("❌ Invalid tickets value:", tickets);
            return res.status(400).json({ success: false, message: "Invalid number of tickets." });
        }

        // Begin transaction
        await client.query('BEGIN');

        // Fetch event details with row lock
        const eventQuery = await client.query(
            `SELECT total_tickets, booked_tickets, available_tickets FROM events WHERE id = $1 FOR UPDATE`,
            [event_id]
        );
        
        if (eventQuery.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, message: "Event not found." });
        }

        const { total_tickets, booked_tickets, available_tickets } = eventQuery.rows[0];

        if (available_tickets < tickets) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: "Not enough tickets available." });
        }

        // Insert booking record
        await client.query(
            `INSERT INTO booked_events (
              customer_id, event_name, category, event_date, event_time, location, price, event_id, tickets_booked
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [customer_id, event_name, category, event_date, event_time, location, price, event_id, tickets]
        );
        
        // Commit the transaction
        await client.query('COMMIT');
  
        res.status(201).json({ 
            message: "Booking successful!",
            
        });
    } catch (err) {
        // Roll back the transaction on error
        await client.query('ROLLBACK');
        console.error("Error booking event:", err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        // Release the client back to the pool
        client.release();
    }
});


  app.get("/booked-events", authenticateToken,  authorizeRole("customer"), async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query(
            `SELECT 
         be.*, 
         e.image_url 
       FROM 
         booked_events be
       JOIN 
         events e 
       ON 
         be.event_id = e.id
       WHERE 
         be.customer_id = $1`,
            [userId]
        );
        res.status(200).json({ success: true, events: result.rows });
    } catch (error) {
        console.error("Error fetching booked events:", error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
});



app.delete("/cancel-booking", async (req, res) => {
    const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ message: "Booking ID is required." });
  }
    try {

        const bookingQuery = await pool.query(
            `SELECT event_id, tickets_booked FROM booked_events WHERE id = $1`,
            [bookingId]
        );

        if (bookingQuery.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found." });
        }


      const result = await pool.query("DELETE FROM booked_events WHERE id = $1", [bookingId]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Booking not found." });
      }
  
      res.status(200).json({ message: "Booking cancelled successfully." });
    } catch (err) {
      console.error("Error cancelling booking:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  });


   
app.get("/events", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM events");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ message: "Error fetching events." });
    }
});
 
app.get("/", (req, res) => {
    res.send("Welcome to the Event Management API!");
});
  
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
