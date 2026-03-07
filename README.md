# 3D Animated Portfolio — Sanjeev Koshti

A premium, high-performance 3D portfolio website built with modern web technologies. This project features immersive 3D environments, custom GLSL shaders, and cinematic scroll-triggered animations.

## 🚀 Live Demo
[View Live Portfolio](https://sanjeevkoshti.github.io/Portfolio/) *(Note: Replace with your actual deployment link)*

---

## ✨ Features
- **Immersive 3D Experience**: Powered by Three.js with a galaxy spiral particle system (3,000+ particles).
- **Custom Shaders**: Iridescent metallic hero model using custom GLSL vertex and fragment shaders.
- **Cinematic Animations**: Smooth, scroll-driven entrances and parallax effects using GSAP and ScrollTrigger.
- **Premium UI**: 
  - Glassmorphism design system.
  - Custom interactive cursor (dot + ring follow).
  - Magnetic button interactions.
  - 3D tilt-effect project cards.
- **Responsive Navigation**: Fullscreen premium mobile menu with staggered entrance animations.
- **Real-time Contact Form**: AJAX-powered form integration with FormSubmit.co for direct email delivery.

## 🛠️ Tech Stack
- **Core**: HTML5, JavaScript (ES6+), CSS3
- **3D Engine**: [Three.js](https://threejs.org/)
- **Animation**: [GSAP](https://greensock.com/gsap/) (GreenSock Animation Platform)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Bundler**: [Vite](https://vitejs.dev/)

---

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Sanjeevkoshti/Portfolio.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Portfolio
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development
Run the local development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Production
Build the project for production:
```bash
npm run build
```
The optimized files will be generated in the `dist/` directory.

---

## 📂 Project Structure
```text
├── src/
│   ├── animations/     # GSAP scroll and hover logic
│   ├── experience/     # Three.js Scene, Camera, and 3D Objects
│   ├── main.js         # Entry point and UI orchestration
│   └── style.css       # Design system and Tailwind directives
├── index.html          # Main entry point
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```
## 👤 Author

**Sanjeev Koshti**
- **BCA Student** @ B R Darur First Grade College
- [GitHub](https://github.com/Sanjeevkoshti)
- [LinkedIn](https://www.linkedin.com/in/sanjeev-koshti-0bb53b356/)
- [Instagram](https://www.instagram.com/mr_san_jeeva9890/)

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.


