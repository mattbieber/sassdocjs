REPORTER = dot
TESTS = $(shell find test -name "*.spec.js")

test:
	mocha $(TESTS)

.PHONY: test

