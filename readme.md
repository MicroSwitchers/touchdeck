TouchTab (Tap to Words)



TouchTab is a lightweight, customizable talking button app for touch screen devices.



Built as a single-file HTML application, it requires no backend, no internet connection (after initial load), and no login. All data—including button configurations and audio recordings—is stored locally on your device.



🎯 Key Features



🗣️ Communication



Text-to-Speech: Uses the device's native synthesized voices.



Custom Audio Recording: Record real human voices, sounds, or music directly to a button using the microphone.



Sequential Phrases: Assign multiple phrases to a single button that cycle with each tap (e.g., "Hello" -> "How are you?" -> "Good to see you").



🎨 Customization



Drag \& Drop Layout: Unlock the interface to drag buttons anywhere on the screen.



Pinch/Scroll to Resize: Easily scale buttons to be larger or smaller based on motor skills.



Visual Styles: Choose from high-contrast colors and toggle labels on/off.



Visual Feedback: Buttons animate and glow while speaking/playing audio.



⚙️ Accessibility \& System



Touch \& Mouse Support: optimized for touchscreens but works fully with a mouse.



Keyboard Shortcuts: Trigger buttons using keys 1, 2, 3, and 4.



Haptics \& Sound Cues: Optional vibration and audio feedback on activation.



Activation Modes: Support for "Press" (activate on touch start) or "Release" (activate on touch end) triggers.



Debounce Control: Adjustable cooldown to prevent accidental double-taps.



🔒 Privacy \& Offline First



Zero Data Collection: No analytics, no cloud storage, no tracking.



Local Storage: Configuration is saved in localStorage, and audio blobs are stored in IndexedDB within your browser.



PWA Ready: Can be added to the Home Screen on iPad (iOS) and Android tablets to run in full-screen standalone mode.



🚀 How to Use



Method 1: Host it (Recommended)



Upload the index.html file to any static hosting service.



Open the URL on your tablet.



Tap "Share" (iOS) or "Menu" (Android) -> "Add to Home Screen".



Launch the app like a native application.



Method 2: Local File



Simply download the index.html file and open it in any modern web browser (Chrome, Safari, Edge, Firefox).



🛠️ Technical Details



This project is a Single File Component architecture without a build step.



Core: HTML5, Vanilla JavaScript.



Styling: Tailwind CSS (via CDN).



Icons: Lucide Icons (via CDN).



Storage: localStorage (JSON config) + IndexedDB (Binary Audio Data).



📄 License



This project is open-source and available under the MIT License.

