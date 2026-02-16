# Community Apps

This directory contains community-contributed applications. Anyone can submit a new app by opening a pull request.

## How to Add a New App

1. **Choose the right file**: Apps are organized by category in JSON files:
   - `browsers.json` - Web browsers
   - `media.json` - Media & entertainment
   - `development.json` - Development tools
   - `utilities.json` - Utility applications
   - `security.json` - Security & privacy
   - `communication.json` - Communication apps
   - `design.json` - Design & creative tools
   - `gaming.json` - Gaming applications

2. **Add your app** to the appropriate JSON file:

```json
{
  "id": "your-app-id",
  "name": "App Name",
  "description": "Short description of the app",
  "category": "development",
  "icon": "/icons/your-app.svg",
  "website": "https://example.com",
  "sourceUrl": "https://github.com/example/app",
  "platforms": {
    "windows": {
      "type": "winget",
      "command": "winget install --id Example.App --accept-source-agreements --accept-package-agreements",
      "packageName": "Example.App"
    },
    "macos": {
      "type": "brew",
      "command": "brew install --cask example-app",
      "packageName": "example-app"
    },
    "linux": {
      "type": "apt",
      "command": "sudo apt install example-app",
      "packageName": "example-app"
    }
  },
  "size": 100,
  "popularity": 80,
  "contributor": "your-github-username",
  "source": "community",
  "verified": true
}
```

3. **Add an icon**: Place the app icon in `public/icons/` as an SVG file.

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier in kebab-case |
| `name` | string | Application name |
| `description` | string | Short description (max 200 chars) |
| `category` | string | One of: browsers, media, development, utilities, security, communication, design, gaming |
| `icon` | string | Path to icon file |
| `website` | string | Official website URL |
| `platforms` | object | At least one platform required |

## Platform Types

| Type | Description |
|------|-------------|
| `winget` | Windows Package Manager |
| `choco` | Chocolatey |
| `brew` | Homebrew Cask (macOS) |
| `apt` | APT (Debian/Ubuntu) |
| `snap` | Snap Store (Linux) |
| `flatpak` | Flatpak (Linux) |
| `dnf` | DNF (Fedora) |
| `direct` | Direct download URL |

## Optional Metadata

| Field | Type | Description |
|-------|------|-------------|
| `contributor` | string | Your GitHub username |
| `verified` | boolean | Set to `true` if you've tested the installation |
| `size` | number | Download size in MB |
| `popularity` | number | Popularity score 0-100 |

## Guidelines

- **Test your commands**: Make sure the installation commands actually work
- **Be specific**: Use exact package names and IDs
- **Include flags**: Add `--accept-source-agreements --accept-package-agreements` for winget
- **One app per PR**: Keep pull requests focused
- **Follow the format**: Use the existing apps as examples

## Verification

Before submitting, please verify:

- [ ] Installation command works on Windows
- [ ] Installation command works on macOS
- [ ] Installation command works on Linux
- [ ] Icon file exists in `public/icons/`
- [ ] JSON syntax is valid
- [ ] App doesn't already exist in core or community
