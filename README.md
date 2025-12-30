# Merdova v2

A React + Vite application with Firebase Cloud Functions integration.

## Firebase Functions

This project includes Firebase Cloud Functions for handling server-side operations like sending emails.

### Function Commands

#### Development

```bash
# Navigate to functions directory
cd functions

# Install dependencies
npm install

# Build functions (TypeScript to JavaScript)
npm run build

# Build and watch for changes
npm run build:watch

# Run functions locally with emulators
npm run serve
# or
firebase emulators:start --only functions

# Run functions in shell mode for testing
npm run shell
```

#### Deployment

```bash
# Deploy all functions
cd functions
npm run deploy
# or from project root
firebase deploy --only functions

# Deploy a specific function
firebase deploy --only functions:sendWizardEmail

# Deploy functions and hosting together
firebase deploy --only functions,hosting
```

#### Monitoring and Logs

```bash
# View function logs
cd functions
npm run logs
# or
firebase functions:log

# View logs for a specific function
firebase functions:log --only sendWizardEmail

# View logs with real-time streaming
firebase functions:log --follow

# View logs with filters
firebase functions:log --limit 50
```

#### Other Useful Commands

```bash
# List all deployed functions
firebase functions:list

# Delete a function
firebase functions:delete sendWizardEmail

# Get function details
firebase functions:describe sendWizardEmail
```

### Managing Secrets

Firebase Functions use secrets to store sensitive configuration data. The `sendWizardEmail` function requires a JSON secret named `FUNCTIONS_CONFIG_EXPORT` that contains SMTP and business email configuration.

#### Setting Secrets

```bash
# Set a JSON secret (for the exported config)
firebase functions:secrets:set FUNCTIONS_CONFIG_EXPORT

# You'll be prompted to enter the JSON value, or you can pipe it:
echo '{"smtp":{"host":"smtp.gmail.com","port":"587","user":"your-email@gmail.com","pass":"your-app-password","from":"your-email@gmail.com"},"business":{"email":"business@example.com"}}' | firebase functions:secrets:set FUNCTIONS_CONFIG_EXPORT

# Or set from a file
firebase functions:secrets:set FUNCTIONS_CONFIG_EXPORT < config.json
```

#### Updating Secrets

```bash
# Update an existing secret (same command as setting)
firebase functions:secrets:set FUNCTIONS_CONFIG_EXPORT

# Access secret value (for verification)
firebase functions:secrets:access FUNCTIONS_CONFIG_EXPORT
```

#### Deploying Secrets

**Important**: After setting or updating secrets, you must redeploy your functions for the changes to take effect:

```bash
# Deploy functions with secrets
firebase deploy --only functions

# The secrets are automatically included during deployment
```

#### Secret Structure

The `FUNCTIONS_CONFIG_EXPORT` secret should be a JSON object with the following structure:

```json
{
  "smtp": {
    "host": "smtp.gmail.com",
    "port": "587",
    "user": "your-email@gmail.com",
    "pass": "your-app-password",
    "from": "your-email@gmail.com"
  },
  "business": {
    "email": "business@example.com"
  }
}
```

#### Listing and Managing Secrets

```bash
# List all secrets
firebase functions:secrets:list

# Delete a secret
firebase functions:secrets:delete FUNCTIONS_CONFIG_EXPORT

# Grant access to a secret (for CI/CD)
firebase functions:secrets:grantaccess FUNCTIONS_CONFIG_EXPORT --project <project-id>
```

#### Migrating from Legacy Config

If you previously used `firebase functions:config:set`, you can export your config to a secret:

```bash
# Export existing config to a secret
firebase functions:config:export | firebase functions:secrets:set FUNCTIONS_CONFIG_EXPORT
```

### Function Development Workflow

1. **Make changes** to `functions/src/index.ts`
2. **Build** the functions: `cd functions && npm run build`
3. **Test locally** with emulators: `npm run serve`
4. **Update secrets** if needed: `firebase functions:secrets:set FUNCTIONS_CONFIG_EXPORT`
5. **Deploy** functions: `npm run deploy` or `firebase deploy --only functions`
6. **Monitor logs**: `firebase functions:log`

### Function Endpoints

- **sendWizardEmail**: `https://sendwizardemail-bgljpyzcqa-uc.a.run.app`
  - Also available via hosting rewrite: `/api/send-wizard-email`
  - Method: POST
  - Handles wizard form submissions and sends confirmation/notification emails

For more details, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

## FTP Deployment

This project includes a script to build and deploy to an FTP server.

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Set the FTP password as an environment variable:
   - **Windows (PowerShell)**: `$env:FTP_PASSWORD="your_password"`
   - **Windows (CMD)**: `set FTP_PASSWORD=your_password`
   - **Linux/Mac**: `export FTP_PASSWORD=your_password`

### Deploy to FTP

```bash
npm run deploy:ftp
```

This command will:
1. Build the project (`npm run build`)
2. Upload all files from the `dist` folder to the FTP server

### FTP Configuration

The FTP server details are configured in `deploy.mjs`:
- **Server**: ftp.merdova.com
- **Port**: 21
- **Username**: info@merdova.com
- **Password**: Set via `FTP_PASSWORD` environment variable
- **Remote Directory**: `public_html` (default)

### Optional: Custom Remote Directory

By default, files are uploaded to the `public_html` directory. If you need to deploy to a different directory, set the `FTP_REMOTE_DIR` environment variable:

```bash
# Windows (PowerShell)
$env:FTP_REMOTE_DIR="custom_folder"
npm run deploy:ftp

# Linux/Mac
export FTP_REMOTE_DIR="custom_folder"
npm run deploy:ftp
```

### Security Note

⚠️ **Never commit your FTP password to version control.** Always use environment variables or a secure secrets management system.

### Features
6. CTA banner
Sticky or scroll-triggered banner
Gradient background with subtle animation
Prominent call-to-action
7. Tech stack showcase
Animated logos of technologies you use
Interactive hover effects
Particle effects or connections between items
8. Team section
Team member cards with hover reveals
Social links and brief bios
Animated entrance effects

Interactive Elements
9. Loading States & Micro-interactions
Skeleton loaders
Button hover animations
Form validation with visual feedback
Success/error toast notifications
10. Scroll Animations
Reveal animations for sections
Parallax effects
Progress indicator
"Scroll to top" button
11. Interactive Background Elements
Particle system
Animated grid pattern
Floating geometric shapes
Gradient mesh animations
Content & Information
12. About Section
Company story/mission
Timeline of milestones
Values/principles
Office photos or workspace
13. Blog/Resources Section
Latest articles or insights
Resource downloads
Industry news
Tips and guides
14. FAQ Section
Accordion-style questions
Searchable FAQ
Categorized by topic
Professional Touches
15. Enhanced Contact Form
Multi-step form with progress
Real-time validation
File upload capability
Calendar integration for scheduling
16. Live Chat Widget
Chatbot or live chat integration
Availability indicator
Quick response options
17. Cookie Consent Banner
GDPR-compliant cookie notice
Customizable preferences
Smooth animations
18. 404 Error Page
Custom designed 404 page
Helpful navigation back
Fun animations
Performance & UX
19. Dark/Light Mode Toggle
Theme switcher
Smooth transitions
User preference persistence
20. Accessibility Improvements
Skip to content link
ARIA labels
Keyboard navigation indicators
Focus states
21. Mobile Enhancements
Bottom navigation bar for mobile
Swipe gestures
Touch-optimized interactions
Visual Polish
22. Gradient Overlays & Glassmorphism
More glassmorphic cards
Layered depth effects
Subtle gradient overlays on images
23. Typography Hierarchy
Better font pairing
Text animations (typewriter, fade-in)
Highlighted quotes
24. Image Galleries
Lightbox for portfolio images
Masonry grid layout
Lazy loading with blur-up
25. Video Integration
Background video in hero
Embedded demo videos
Testimonial videos