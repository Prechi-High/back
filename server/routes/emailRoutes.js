// Backend: Express server for sending emails via Resend API
// Install dependencies: npm install express cors body-parser axios dotenv



const app = express();
const router = express.Router();
const RESEND_API_KEY = "re_Gmg3QRNr_BHcNhhY1RJ9qqkCui9DE6ZTi"

// Email sending endpoint
app.post("/send-email", async (req, res) => {
    const { to, subject, message } = req.body;
    
    try {
        const response = await axios.post("https://api.resend.com/emails", {
            from: "your-email@yourdomain.com", // Set up in Resend
            to,
            subject,
            html: `<p>${message}</p>`
        }, {
            headers: {
                "Authorization": `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;