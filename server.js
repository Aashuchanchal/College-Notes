require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

// Serialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, { provider: 'google', id: profile.id, displayName: profile.displayName, email: profile.emails[0].value });
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, { provider: 'github', id: profile.id, displayName: profile.displayName, email: profile.emails[0].value });
}));

// Microsoft (Azure AD) Strategy
passport.use(new OIDCStrategy({
    identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
    clientID: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    responseType: 'code',
    responseMode: 'query',
    redirectUrl: "http://localhost:5500/auth/microsoft/callback",
    allowHttpForRedirectUrl: true,
    scope: ['profile', 'email']
}, (iss, sub, profile, accessToken, refreshToken, done) => {
    return done(null, { provider: 'microsoft', id: profile.oid, displayName: profile.displayName, email: profile._json.preferred_username });
}));

// Helper: Create JWT
function createToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Google routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const token = createToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
});

// GitHub routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    const token = createToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
});

// Microsoft routes
app.get('/auth/microsoft', passport.authenticate('azuread-openidconnect'));
app.get('/auth/microsoft/callback', passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }), (req, res) => {
    const token = createToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
});

// Example protected route
app.get('/api/profile', (req, res) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No token' });
    try {
        const user = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
        res.json({ user });
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.listen(5500, () => console.log('Backend running on http://localhost:5500'));
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save files to 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});
const upload = multer({ storage: storage });

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.json({ 
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`
    });
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));