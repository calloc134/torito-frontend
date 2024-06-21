# Tauriアプリのルートディレクトリ
APP_ROOT := .

# Tauriアプリの名前
APP_NAME := torito-app

# Tauriアプリのビルドターゲット
TARGETS := linux-x86_64

BINARY_DOWNLOAD_DIR := $(APP_ROOT)/src-tauri

check_deps: 
	@echo "Checking dependencies..."
	@dpkg -l | grep libgtk-3-dev || { echo "libgtk-3-dev is not installed. Installing..."; sudo apt-get install libgtk-3-dev; }
	@dpkg -l | grep  libsoup2.4-dev || { echo "libsoup2.4-dev is not installed. Installing..."; sudo apt-get install libsoup2.4-dev; }
	@dpkg -l | grep libwebkit2gtk-4.0-dev || { echo "libwebkit2gtk-4.0-dev is not installed. Installing..."; sudo apt-get install libwebkit2gtk-4.0-dev; }
	@dpkg -l | grep libjavascriptcoregtk-4.0-dev || { echo "libjavascriptcoregtk-4.0-dev is not installed. Installing..."; sudo apt-get install libjavascriptcoregtk-4.0-dev; }

# Tauriアプリのビルドコマンド
build:
	@echo "Building Tauri app..."
	# 最新のpythonバイナリをgithub releasesからダウンロード
	# ダウンロード先ディレクトリはAPP_ROOT/src-tauri
	@cd $(APP_ROOT)
	@mkdir -p $(BINARY_DOWNLOAD_DIR)
	@url=$$(curl -s https://api.github.com/repos/calloc134/torito-prototype/releases/latest | grep "browser_download_url" | cut -d '"' -f 4) && wget -P $(BINARY_DOWNLOAD_DIR) $$url
	@mv $(BINARY_DOWNLOAD_DIR)/torito_prototype $(BINARY_DOWNLOAD_DIR)/torito-prototype-x86_64-unknown-linux-gnu
	@chmod +x $(BINARY_DOWNLOAD_DIR)/torito-prototype-x86_64-unknown-linux-gnu
	@pnpm install
	@pnpm tauri build

