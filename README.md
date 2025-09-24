# 3D Audio Sphere Visualizer

A stunning 3D mesh sphere audio visualizer that transforms your music into mesmerizing visual experiences. Upload any audio file and watch as the 3D sphere responds to the music in real-time, creating a captivating audio-visual experience.

![3D Audio Visualizer](https://img.shields.io/badge/3D-Audio%20Visualizer-64ffda)
![HTML5](https://img.shields.io/badge/HTML5-Audio%20API-orange)
![Three.js](https://img.shields.io/badge/Three.js-3D%20Graphics-blue)
![WebGL](https://img.shields.io/badge/WebGL-Hardware%20Accelerated-green)

## 🌟 Features

- **3D Sphere Visualization**: Real-time audio reactive 3D mesh sphere
- **File Upload**: Support for MP3, WAV, OGG, and M4A audio formats
- **Drag & Drop**: Easy file handling with drag and drop interface
- **Interactive Controls**: 
  - Play/Pause functionality
  - Volume control
  - Sensitivity adjustment for visualization intensity
- **3D Navigation**: Mouse controls for orbiting, zooming, and panning
- **Frequency Bars**: Real-time frequency spectrum display
- **Responsive Design**: Works on desktop and mobile devices
- **Browser Compatible**: Runs in modern web browsers with WebGL support

## 🚀 Demo

[Live Demo](https://3d-audio-sphere.netlify.app)

## 📋 Prerequisites

- Modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)
- Web Audio API support (available in all modern browsers)
- Local web server (for local development) or GitHub Pages for hosting

## 🛠️ Setup Instructions

### Method 1: GitHub Pages (Recommended)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sarkarsubhadip604-dotcom/3d-audio-sphere-visualizer.git
   cd 3d-audio-sphere-visualizer
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings on GitHub
   - Navigate to "Pages" in the sidebar
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
   - Your site will be available at: `https://yourusername.github.io/3d-audio-sphere-visualizer/`

### Method 2: Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sarkarsubhadip604-dotcom/3d-audio-sphere-visualizer.git
   cd 3d-audio-sphere-visualizer
   ```

2. **Start a local web server**:

   **Using Python 3**:
   ```bash
   python -m http.server 8000
   ```

   **Using Python 2**:
   ```bash
   python -m SimpleHTTPServer 8000
   ```

   **Using Node.js**:
   ```bash
   npx http-server
   ```

   **Using PHP**:
   ```bash
   php -S localhost:8000
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

### Method 3: Direct File Opening (Limited Functionality)

⚠️ **Note**: Due to CORS restrictions, some browsers may not allow file uploads when opening the HTML file directly. Use a local server for full functionality.

1. Download the `index.html` file
2. Double-click to open in your web browser
3. Some features may be limited due to security restrictions

## 🎵 Usage

1. **Upload Audio File**:
   - Click the "Choose Audio File" button, or
   - Drag and drop an audio file onto the upload area

2. **Control Playback**:
   - Click the play button (▶) to start audio playback
   - The sphere will begin visualizing the audio in real-time
   - Use the pause button (⏸) to stop playback

3. **Adjust Settings**:
   - **Volume**: Control audio playback volume
   - **Sensitivity**: Adjust how responsive the visualization is to the audio

4. **Interact with 3D View**:
   - **Mouse**: Click and drag to orbit around the sphere
   - **Wheel**: Scroll to zoom in/out
   - **Auto-rotate**: The sphere automatically rotates for dynamic viewing

## 🔧 Technical Details

### Technologies Used

- **HTML5**: Structure and audio elements
- **CSS3**: Styling and responsive design
- **JavaScript**: Core functionality and audio processing
- **Three.js**: 3D graphics rendering
- **Web Audio API**: Real-time audio analysis
- **WebGL**: Hardware-accelerated graphics

### Browser Compatibility

| Browser | Version | Supported |
|---------|---------|-----------||
| Chrome  | 60+     | ✅ Full   |
| Firefox | 55+     | ✅ Full   |
| Safari  | 11+     | ✅ Full   |
| Edge    | 79+     | ✅ Full   |
| IE      | Any     | ❌ No     |

### Audio Format Support

| Format | Extension | Supported |
|--------|-----------|-----------||
| MP3    | .mp3      | ✅ Yes    |
| WAV    | .wav      | ✅ Yes    |
| OGG    | .ogg      | ✅ Yes    |
| M4A    | .m4a      | ✅ Yes    |
| FLAC   | .flac     | ❌ Limited |

## 🎨 Customization

The visualizer can be customized by modifying the following parameters in the JavaScript code:

```javascript
// Sphere properties
const sphereRadius = 1.5;      // Size of the sphere
const sphereSegments = 64;     // Detail level (higher = smoother)

// Visualization sensitivity
const baseSensitivity = 1.0;   // Default sensitivity multiplier

// Colors
const primaryColor = 0x64ffda; // Teal color for sphere
const accentColor = 0x1de9b6;  // Accent color for effects
```

## 🚨 Troubleshooting

### Common Issues

1. **Audio not playing**:
   - Ensure the audio file format is supported
   - Check browser audio permissions
   - Try a different audio file

2. **Visualization not working**:
   - Verify WebGL is enabled in your browser
   - Check browser console for errors
   - Ensure you're using a local server (not file://)

3. **File upload not working**:
   - Use a local web server instead of opening file directly
   - Check if the file size is reasonable (<100MB)
   - Ensure file format is supported

4. **Performance issues**:
   - Try reducing browser zoom level
   - Close other resource-intensive applications
   - Use a more powerful device if available

### Browser Console Errors

Open browser Developer Tools (F12) and check the Console tab for error messages.

## 📱 Mobile Support

The visualizer is optimized for mobile devices:
- Touch controls for 3D navigation
- Responsive design that adapts to screen size
- Optimized performance for mobile GPUs
- Touch-friendly UI controls

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test locally
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - Amazing 3D graphics library
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - For audio analysis capabilities
- Font icons and design inspiration from various sources

## 📬 Contact

- **GitHub**: [@sarkarsubhadip604-dotcom](https://github.com/sarkarsubhadip604-dotcom)
- **Repository**: [3d-audio-sphere-visualizer](https://github.com/sarkarsubhadip604-dotcom/3d-audio-sphere-visualizer)

---

Made with ❤️ and lots of coffee ☕

**Enjoy the visual music experience! 🎵✨**
