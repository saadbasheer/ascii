# ASCII Wave Studio

A real-time ASCII art generator with animated noise effects, powered by WebGL and simplex noise. Create mesmerizing ASCII animations with full control over visual parameters and export in multiple formats.

![ASCII Wave Studio](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)

## Features

### Real-time ASCII Rendering

- **WebGL-accelerated** rendering for smooth performance
- **Customizable character sets** (minimal, medium, detailed)
- **Live preview** with instant parameter updates
- **High-resolution** output support

### Animation Controls

- **Simplex noise-based** animation system
- Adjustable noise scale, strength, and speed
- Control over frequency and distortion
- Looping animations with configurable duration

### Visual Parameters

- **Color adjustments**: brightness, contrast, saturation, hue
- **Tinting**: customizable foreground and background colors
- **Effects**: vignette, gamma correction, glyph sharpness
- **Black & white mode** for classic ASCII aesthetic

### Export Formats

- **Looping GIF**: Animated GIF export with configurable frame rate
- **PNG**: High-quality static image export
- **SVG**: Vector format for scalable graphics
- **TXT**: Plain text ASCII art
- **React Component**: Export as a ready-to-use React component

### Preset Management

- Save your favorite configurations
- Load presets instantly
- Share presets via URL (compressed and encoded)

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ascii

# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
# Create an optimized production build
pnpm build

# Start the production server
pnpm start
```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **UI Components**: [Radix UI](https://www.radix-ui.com)
- **Animation**: [simplex-noise](https://github.com/jwagner/simplex-noise.js)
- **GIF Export**: [gif.js](https://github.com/jnordberg/gif.js)
- **Icons**: [Lucide React](https://lucide.dev)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   └── layout.tsx         # Root layout with metadata
├── components/            # React components
│   ├── AsciiCanvas.tsx   # Main canvas component
│   ├── ControlsPanel.tsx # Parameter controls
│   ├── FloatingControls.tsx
│   ├── PresetManager.tsx
│   └── ui/               # Reusable UI components
├── lib/                   # Core logic
│   ├── asciiEngine.ts    # ASCII rendering engine
│   ├── glyphAtlas.ts     # Character atlas generation
│   ├── noise.ts          # Noise generation utilities
│   ├── types.ts          # TypeScript type definitions
│   └── exporters/        # Export functionality
└── styles/               # Global styles
```

## Usage

1. **Adjust Parameters**: Use the floating controls panel to modify visual parameters in real-time
2. **Create Animation**: Configure noise and animation settings to create dynamic effects
3. **Save Presets**: Save your favorite configurations for later use
4. **Export**: Choose your preferred export format and download your creation

## Performance

- Optimized WebGL rendering pipeline
- Efficient glyph atlas caching
- Requestanimationframe-based animation loop
- Responsive canvas with automatic resizing

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
