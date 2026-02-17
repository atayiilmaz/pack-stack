# PackStack

> A modern, open-source package installer that helps you discover and install software across multiple operating systems.

![PackStack](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Overview

PackStack is a web application that lets you search for software packages from official package repositories and generate custom installation scripts. Simply select your operating system, search for packages, and get a ready-to-run script to install everything at once.

## Features

- **Real-time Search** – Search official package repositories directly
- **Multi-platform Support** – Windows, macOS, and Linux (Ubuntu/Debian, Arch, Fedora)
- **Bulk Installation** – Select multiple packages and generate a single script
- **Smart Scripts** – Generated scripts include error handling, verification, and idempotent operations
- **No Account Required** – Completely anonymous, no tracking or analytics
- **Modern UI** – Clean, responsive interface with smooth animations

## Supported Platforms

| Platform | Package Manager |
|----------|----------------|
| Windows | Winget |
| macOS | Homebrew (formulae & casks) |
| Ubuntu/Debian | APT |
| Arch Linux | Pacman + AUR (yay/paru) |
| Fedora | DNF |

## Installation

```bash
# Clone the repository
git clone https://github.com/atayiilmaz/packstack.git
cd packstack

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run start
```

The project is configured for static export and can be deployed to any static hosting service.

## Tech Stack

- **Next.js 16** – React framework with App Router
- **React 19** – UI library
- **TypeScript** – Type safety
- **Tailwind CSS v4** – Styling
- **shadcn/ui** – UI components

## Project Structure

```
packstack/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/              # Package manager clients
│   └── types/            # TypeScript definitions
├── public/               # Static assets
└── package.json
```

## How It Works

1. **Select Platform** – Choose your operating system
2. **Search Packages** – Real-time search against official APIs
3. **Select Packages** – Add packages to your install list
4. **Generate Script** – Get a custom installation script with:
   - Package manager verification
   - Error handling
   - Progress tracking
   - Idempotent operations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Package data is sourced from official package repositories
- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
