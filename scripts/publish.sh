#!/bin/sh

set -e

pnpm i
# pnpm i
pnpm update:version

pnpm build

cd dist/tav-ui
npm publish
cd -

echo "✅ Publish completed"
