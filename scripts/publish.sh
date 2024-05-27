#!/bin/sh

set -e

# pnpm i --frozen-lockfile
pnpm i
pnpm update:version

pnpm build

cd dist/tav-ui
npm publish
cd -

echo "✅ Publish completed"
