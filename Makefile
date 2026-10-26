.PHONY: help install test audit docs serve demos og doctor clean

help:
	@printf "BUREAU\n\n"
	@printf "  make install     install the skill for all hosts (user scope)\n"
	@printf "  make test        run node --test\n"
	@printf "  make audit       static audit of templates and landing\n"
	@printf "  make docs        build the trilingual static site into dist/\n"
	@printf "  make serve       build docs and serve dist/ on :4173\n"
	@printf "  make demos       recapture template screenshots\n"
	@printf "  make og          render the 1200x630 social image\n"
	@printf "  make doctor      environment report\n"
	@printf "  make clean       remove dist/ and node_modules/\n"

install:
	bash installers/install.sh --agent all --scope user

test:
	npm test

audit:
	node skill/scripts/audit.mjs skill/assets/templates site/index.html --fail-on p1

docs:
	node scripts/build-docs.mjs

serve: docs
	node scripts/serve.mjs dist 4173

demos:
	node scripts/capture-demos.mjs

og:
	node scripts/og.mjs

doctor:
	node skill/scripts/doctor.mjs

clean:
	rm -rf dist node_modules
