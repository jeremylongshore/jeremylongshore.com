#!/usr/bin/env bash
# Build script for Linkyee on Netlify

set -eu  # Exit on error or unset variable

SITE_DIR="_output"

build() {
  # clean
  if [[ -d $SITE_DIR ]]; then
    rm -rf "$SITE_DIR"
  fi

  # Install bundler if not present
  if ! command -v bundle &> /dev/null; then
    echo "Installing bundler..."
    gem install bundler
  fi

  # Install bundle dependencies
  bundle install

  # Run the Ruby script to generate the output
  bundle exec ruby "./scaffold.rb"

  echo "Build complete! Output in $SITE_DIR/"
}

# Execute build
build
