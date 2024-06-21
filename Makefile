# Tauriアプリのルートディレクトリ
APP_ROOT := .

# Tauriアプリの名前
APP_NAME := torito-app

# Tauriアプリのビルドターゲット
TARGETS := linux-x86_64

BINARY_DOWNLOAD_DIR := $(APP_ROOT)/src-tauri

# Tauriアプリのビルドコマンド
build:
	@echo "Building Tauri app..."
	# 最新のpythonバイナリをgithub releasesからダウンロード
	# ダウンロード先ディレクトリはAPP_ROOT/src-tauri
	@cd $(APP_ROOT)
	@mkdir -p $(BINARY_DOWNLOAD_DIR)
	@url=$$(curl -s https://api.github.com/repos/calloc134/torito-prototype/releases/latest | grep "browser_download_url" | cut -d '"' -f 4) && wget -P $(BINARY_DOWNLOAD_DIR) $$url
	@mv $(BINARY_DOWNLOAD_DIR)/torito_prototype $(BINARY_DOWNLOAD_DIR)/torito-prototype-x86_64-unknown-linux-gnu
	@pnpm install
	@pnpm tauri build

