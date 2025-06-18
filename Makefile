# Makefile for building the Electron application

# Variables
PNPM = pnpm
ELECTRON_BUILDER = $(PNPM) electron:build

# Targets
.PHONY: all build-mac build-windows build-linux clean

all: build-mac build-windows build-linux

build-mac:
	$(ELECTRON_BUILDER) --mac

build-windows:
	$(ELECTRON_BUILDER) --win

build-linux:
	$(ELECTRON_BUILDER) --linux

clean:
	rm -rf dist-electron
	@echo "Cleaned build artifacts."
