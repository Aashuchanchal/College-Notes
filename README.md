# College Notes

A student learning portal for accessing premium notes, projects, and resources for all major academic streams.

## Features
- Social login (Google, GitHub, Microsoft)
- Downloadable notes and project resources
- File upload support
- Responsive UI with Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Aashuchanchal/College-Notes.git
   cd College-Notes
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your credentials:
   ```sh
   cp .env.example .env
   # Then edit .env with your secrets
   ```

### Running the App
- Start the backend server:
  ```sh
  node server.js
  ```
- Open `Index.html` in your browser or serve it with a static server.

## Security
- **Never commit your `.env` file.**
- Regenerate OAuth secrets if they were exposed.

## License
MIT