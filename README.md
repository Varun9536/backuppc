# ISyncLite Admin Panel

A modern React-based admin interface for ISyncLite, built on top of BackupPC.

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

## Features

- Global Configuration Management
- Host Management (Add/Edit/List)
- Backup Management and Monitoring
- File Restore Interface
- Reports & Logs Viewer
- Notification Configuration

## Project Structure

```
src/
  ├── components/     # Reusable components (Layout, Navigation)
  ├── pages/          # Page components (Home, GlobalConfig, Hosts, etc.)
  ├── services/       # API service layer (mock data - replace with real API calls)
  ├── context/        # React Context for state management
  ├── styles/         # Global CSS styles
  └── App.jsx         # Main app component with routing
```

## API Integration

The application currently uses mock API calls in `src/services/api.js`. To connect to your Perl/BackupPC backend:

1. Replace the mock functions in `src/services/api.js` with actual API calls
2. Update the API endpoints to match your backend server
3. Ensure CORS is properly configured on your backend if serving from a different origin

Example API structure:
- `globalConfigAPI` - Global configuration endpoints
- `hostsAPI` - Host management endpoints
- `backupsAPI` - Backup operations endpoints
- `restoreAPI` - File restore endpoints
- `reportsAPI` - Logs and reports endpoints
- `notificationsAPI` - Notification configuration endpoints

## Technologies Used

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS Modules** - Scoped styling
- **Context API** - State management

