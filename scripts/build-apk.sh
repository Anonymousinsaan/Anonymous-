#!/bin/bash

# NebulaForge X APK Builder
# Automated script to build Android APK from web app

set -e

echo "🚀 NebulaForge X APK Builder"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build configuration
BUILD_TYPE=${1:-debug}  # debug or release
PROJECT_NAME="NebulaForge X"
APP_ID="com.nebulaforge.x"
BUILD_DIR="./android"
DIST_DIR="./dist"
APK_OUTPUT_DIR="./builds"

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    # Check if Capacitor is installed
    if ! npx cap --version &> /dev/null; then
        log_warning "Capacitor CLI not found, installing..."
        npm install -g @capacitor/cli
    fi
    
    # Check Java (for Android builds)
    if ! command -v java &> /dev/null; then
        log_warning "Java not found. Please install Java 11 or higher for Android builds"
    fi
    
    log_success "Prerequisites check completed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    # Install Node.js dependencies
    npm install
    
    # Install Capacitor dependencies
    npm install @capacitor/core @capacitor/cli @capacitor/android
    
    log_success "Dependencies installed"
}

# Build web assets
build_web_assets() {
    log_info "Building optimized web assets..."
    
    # Clean previous build
    rm -rf $DIST_DIR
    
    # Build with Vite
    npm run build:frontend
    
    # Verify build output
    if [ ! -d "$DIST_DIR" ]; then
        log_error "Web build failed - dist directory not found"
        exit 1
    fi
    
    log_success "Web assets built successfully"
}

# Initialize Capacitor project
init_capacitor() {
    log_info "Initializing Capacitor project..."
    
    # Initialize Capacitor if not already done
    if [ ! -f "capacitor.config.ts" ]; then
        npx cap init "$PROJECT_NAME" "$APP_ID" --web-dir="$DIST_DIR"
    fi
    
    # Add Android platform if not already added
    if [ ! -d "$BUILD_DIR" ]; then
        npx cap add android
    fi
    
    log_success "Capacitor project initialized"
}

# Sync web assets to native project
sync_assets() {
    log_info "Syncing web assets to Android project..."
    
    npx cap sync android
    
    log_success "Assets synced to Android project"
}

# Configure Android build
configure_android() {
    log_info "Configuring Android build settings..."
    
    # Create Android resource directories
    mkdir -p "$BUILD_DIR/app/src/main/res/values"
    mkdir -p "$BUILD_DIR/app/src/main/res/mipmap-hdpi"
    mkdir -p "$BUILD_DIR/app/src/main/res/mipmap-mdpi"
    mkdir -p "$BUILD_DIR/app/src/main/res/mipmap-xhdpi"
    mkdir -p "$BUILD_DIR/app/src/main/res/mipmap-xxhdpi"
    mkdir -p "$BUILD_DIR/app/src/main/res/mipmap-xxxhdpi"
    
    # Create app name configuration
    cat > "$BUILD_DIR/app/src/main/res/values/strings.xml" << EOF
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">NebulaForge X</string>
    <string name="title_activity_main">NebulaForge X</string>
    <string name="package_name">com.nebulaforge.x</string>
    <string name="custom_url_scheme">nebulaforge</string>
</resources>
EOF
    
    # Configure app theme
    cat > "$BUILD_DIR/app/src/main/res/values/styles.xml" << EOF
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.DarkActionBar">
        <item name="colorPrimary">#000000</item>
        <item name="colorPrimaryDark">#000000</item>
        <item name="colorAccent">#00d4ff</item>
        <item name="android:statusBarColor">#000000</item>
        <item name="android:navigationBarColor">#000000</item>
        <item name="android:windowFullscreen">true</item>
    </style>
</resources>
EOF
    
    log_success "Android configuration completed"
}

# Build APK
build_apk() {
    log_info "Building Android APK..."
    
    cd "$BUILD_DIR"
    
    if [ "$BUILD_TYPE" = "release" ]; then
        log_info "Building release APK..."
        ./gradlew assembleRelease
        
        APK_PATH="app/build/outputs/apk/release/app-release-unsigned.apk"
        if [ -f "$APK_PATH" ]; then
            log_warning "APK built but not signed. You'll need to sign it for distribution."
        fi
    else
        log_info "Building debug APK..."
        ./gradlew assembleDebug
        
        APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    fi
    
    cd ..
    
    # Create builds directory
    mkdir -p "$APK_OUTPUT_DIR"
    
    # Copy APK to builds directory
    if [ -f "$BUILD_DIR/$APK_PATH" ]; then
        TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
        OUTPUT_APK="$APK_OUTPUT_DIR/NebulaForge-X-${BUILD_TYPE}-${TIMESTAMP}.apk"
        cp "$BUILD_DIR/$APK_PATH" "$OUTPUT_APK"
        
        # Get APK size
        APK_SIZE=$(du -h "$OUTPUT_APK" | cut -f1)
        
        log_success "APK built successfully!"
        log_success "Location: $OUTPUT_APK"
        log_success "Size: $APK_SIZE"
        
        # Generate QR code for easy installation (if qrencode is available)
        if command -v qrencode &> /dev/null; then
            QR_FILE="$APK_OUTPUT_DIR/install-qr.png"
            echo "file://$(pwd)/$OUTPUT_APK" | qrencode -o "$QR_FILE"
            log_success "QR code generated: $QR_FILE"
        fi
        
    else
        log_error "APK build failed - output file not found"
        exit 1
    fi
}

# Create installation package
create_install_package() {
    log_info "Creating installation package..."
    
    PACKAGE_DIR="$APK_OUTPUT_DIR/NebulaForge-X-Package"
    mkdir -p "$PACKAGE_DIR"
    
    # Copy APK
    cp "$APK_OUTPUT_DIR"/*.apk "$PACKAGE_DIR/"
    
    # Create installation instructions
    cat > "$PACKAGE_DIR/INSTALL.md" << EOF
# NebulaForge X - Installation Guide

## 📱 Android Installation

### Method 1: Direct Installation
1. Enable "Unknown Sources" in Android Settings > Security
2. Download the APK file to your Android device
3. Tap the APK file to install
4. Follow the installation prompts

### Method 2: ADB Installation (Developer)
\`\`\`bash
adb install NebulaForge-X-*.apk
\`\`\`

## 🎮 Getting Started
1. Launch NebulaForge X from your app drawer
2. Grant necessary permissions when prompted
3. Start creating amazing games!

## 📋 System Requirements
- Android 7.0 (API level 24) or higher
- 2GB RAM minimum (4GB recommended)
- 500MB free storage space
- OpenGL ES 3.0 support

## 🔧 Troubleshooting
- If installation fails, ensure you have enough storage space
- For performance issues, close other apps before launching
- Check that your device supports WebGL for 3D features

## 🌟 Features
- AI-powered game development
- Visual scripting interface
- 3D engine with WebGL support
- Export to multiple platforms
- Offline capability
- Real-time collaboration

Enjoy creating with NebulaForge X!
EOF
    
    # Create ZIP package
    cd "$APK_OUTPUT_DIR"
    zip -r "NebulaForge-X-Complete.zip" "NebulaForge-X-Package/"
    cd ..
    
    log_success "Installation package created: $APK_OUTPUT_DIR/NebulaForge-X-Complete.zip"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up temporary files..."
    # Add any cleanup tasks here
    log_success "Cleanup completed"
}

# Main build process
main() {
    echo "Starting build process for: $BUILD_TYPE"
    echo "Project: $PROJECT_NAME"
    echo "App ID: $APP_ID"
    echo ""
    
    check_prerequisites
    install_dependencies
    build_web_assets
    init_capacitor
    sync_assets
    configure_android
    build_apk
    create_install_package
    
    echo ""
    echo "🎉 Build process completed successfully!"
    echo ""
    echo "📱 Your NebulaForge X APK is ready!"
    echo "📍 Location: $APK_OUTPUT_DIR/"
    echo ""
    echo "To install on your Android device:"
    echo "1. Transfer the APK to your phone"
    echo "2. Enable 'Install from Unknown Sources'"
    echo "3. Tap the APK to install"
    echo ""
    echo "Happy game development! 🚀"
}

# Handle script arguments
case "$1" in
    "release")
        BUILD_TYPE="release"
        ;;
    "debug"|"")
        BUILD_TYPE="debug"
        ;;
    "clean")
        log_info "Cleaning build directories..."
        rm -rf "$BUILD_DIR" "$DIST_DIR" "$APK_OUTPUT_DIR"
        log_success "Clean completed"
        exit 0
        ;;
    "help"|"-h"|"--help")
        echo "NebulaForge X APK Builder"
        echo ""
        echo "Usage: $0 [debug|release|clean|help]"
        echo ""
        echo "Commands:"
        echo "  debug    - Build debug APK (default)"
        echo "  release  - Build release APK (requires signing)"
        echo "  clean    - Clean all build directories"
        echo "  help     - Show this help message"
        echo ""
        exit 0
        ;;
    *)
        log_error "Unknown option: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac

# Run main build process
main