# SignAI Text-to-ISL Frontend

## Overview
This project is the standalone React frontend for SignAI text/audio to Indian Sign Language conversion.

It is intentionally kept as a separate React app and integrated into the main product experience by:
- consistent branding and visual language,
- route simplification to a single conversion experience,
- and local runtime alignment with the main frontend.

## Local Development
1. Go to client:
   - `cd client`
2. Install dependencies:
   - `npm install`
3. Start development server:
   - `npm start`

The app runs at:
- `http://localhost:5000/`

## Runtime Notes
- Root route (`/`) loads the conversion interface directly.
- No marketing/landing routes are used in the integrated SignAI flow.
