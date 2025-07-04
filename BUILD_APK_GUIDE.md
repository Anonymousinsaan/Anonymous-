# 📱 NebulaForge X APK Build Guide

## 🚀 Complete APK Generation Process

### ⚡ Quick Start (Automatic Build)

```bash
# Make the build script executable
chmod +x scripts/build-apk.sh

# Build debug APK (recommended for testing)
./scripts/build-apk.sh debug

# Build release APK (for distribution)
./scripts/build-apk.sh release
```

**⏱️ Build Time: 8-12 minutes**  
**📦 Output: `./builds/NebulaForge-X-*.apk`**

---

## 🛠️ Manual Step-by-Step Process

### 1. Prerequisites Setup

```bash
# Install Node.js dependencies
npm install

# Install Capacitor globally (if not already installed)
npm install -g @capacitor/cli

# Verify Capacitor installation
npx cap --version
```

### 2. Build Optimized Web Assets

```bash
# Build with all optimizations enabled
npm run build:frontend

# Verify build output
ls -la dist/
```

### 3. Initialize Mobile Project

```bash
# Initialize Capacitor (first time only)
npx cap init "NebulaForge X" "com.nebulaforge.x" --web-dir="dist"

# Add Android platform
npx cap add android
```

### 4. Sync and Build APK

```bash
# Sync web assets to Android project
npx cap sync android

# Build the APK
cd android
./gradlew assembleDebug

# Your APK will be at:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📋 System Requirements

### Development Machine

- **Node.js**: 16.0+ 
- **Java**: JDK 11 or higher
- **Android SDK**: API Level 24+
- **Storage**: 2GB free space for build
- **RAM**: 4GB minimum (8GB recommended)

### Target Android Device

- **Android**: 7.0+ (API Level 24)
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 500MB free space
- **GPU**: OpenGL ES 3.0 support

---

## 🎯 Build Options

### Debug APK (Recommended for Testing)
```bash
./scripts/build-apk.sh debug
```
- ✅ **Quick build** (5-8 minutes)
- ✅ **Debugging enabled**
- ✅ **No signing required**
- ✅ **Perfect for testing**

### Release APK (For Distribution)
```bash
./scripts/build-apk.sh release
```
- 🔐 **Optimized & minified**
- 🔐 **Requires signing for distribution**
- 🔐 **Production ready**
- ⏱️ **Longer build time** (10-15 minutes)

---

## 📦 What You Get

After building, you'll find in `./builds/`:

```
NebulaForge-X-Package/
├── NebulaForge-X-debug-20241215_143022.apk    # Your APK file
├── INSTALL.md                                  # Installation guide
└── install-qr.png                            # QR code (if available)

NebulaForge-X-Complete.zip                     # Complete package
```

**APK File Size**: ~45-60 MB  
**Installation Size**: ~120-150 MB

---

## 📱 Installation on Android Device

### Method 1: Direct Transfer

1. **Transfer APK** to your Android device via:
   - USB cable
   - Email attachment
   - Cloud storage (Google Drive, Dropbox)
   - ADB push

2. **Enable Unknown Sources**:
   - Go to **Settings > Security**
   - Enable **"Install from Unknown Sources"**
   - Or allow for specific apps (Chrome, File Manager)

3. **Install APK**:
   - Tap the APK file in your file manager
   - Follow installation prompts
   - Grant necessary permissions

### Method 2: ADB Installation (Developer)

```bash
# Connect device with USB debugging enabled
adb devices

# Install APK directly
adb install builds/NebulaForge-X-*.apk

# Launch the app
adb shell am start -n com.nebulaforge.x/.MainActivity
```

---

## 🔧 Troubleshooting

### Build Issues

**Error: "Java not found"**
```bash
# Install Java 11 or higher
sudo apt install openjdk-11-jdk  # Ubuntu/Debian
brew install java11               # macOS
```

**Error: "Android SDK not found"**
```bash
# Set ANDROID_HOME environment variable
export ANDROID_HOME=/path/to/android-sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

**Error: "Capacitor command not found"**
```bash
# Install Capacitor CLI globally
npm install -g @capacitor/cli
```

### Installation Issues

**"App not installed"**
- Ensure sufficient storage space (500MB+)
- Check Android version (7.0+ required)
- Enable "Install from Unknown Sources"

**"Parse error"**
- APK file may be corrupted - re-download
- Incompatible architecture - ensure ARM/x86 support

**Performance Issues**
- Close other apps before launching
- Restart device if memory is low
- Ensure OpenGL ES 3.0 support

---

## 🌟 Features in Your APK

Your NebulaForge X APK includes:

### 🎮 Game Development
- **Visual Scripting Interface**
- **3D Scene Editor** 
- **Real-time Preview**
- **Asset Management**

### 🤖 AI Assistance
- **NebulaVoid AI** - Code generation
- **SentinelFlux** - Self-healing code
- **Natural language game creation**
- **Smart debugging**

### 📱 Mobile Optimized
- **Touch-friendly UI**
- **Responsive design**
- **Offline capability**
- **Hardware acceleration**

### 🚀 Export Options
- **Web (HTML5/PWA)**
- **Desktop (Electron)**
- **Mobile (APK/IPA)**
- **VR (WebXR)**

---

## 📊 Performance Optimization

Your APK is optimized with:

- ✅ **Code splitting** - Faster loading
- ✅ **Lazy loading** - Reduced memory usage
- ✅ **Asset compression** - Smaller download
- ✅ **Tree shaking** - Removed unused code
- ✅ **Hardware acceleration** - Smooth animations
- ✅ **Service worker** - Offline support

---

## 🎉 Ready to Use!

Once installed, NebulaForge X provides:

1. **Instant Game Creation** - Start building immediately
2. **AI-Powered Development** - Let AI help you code
3. **Cross-Platform Export** - Deploy everywhere
4. **Real-time Collaboration** - Work with teams
5. **Professional Tools** - Industry-standard features

---

## 🆘 Need Help?

If you encounter any issues:

1. **Check the logs**: Look in `builds/build.log`
2. **Clean build**: Run `./scripts/build-apk.sh clean`
3. **Verify system**: Ensure all prerequisites are met
4. **Try debug build**: Start with debug APK first

**Happy game development!** 🚀