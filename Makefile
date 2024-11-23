.PHONY: front

# backend
up:
	deno task dev

# frontend
front:
	cd front && pnpm dev

test:
	deno test -R --allow-env