/**
 * Global constants
 * @module lib/env/const
 */

/** regex enums */
exports.REGEX = Object.freeze({
	DOCBLOCK:           /\/\*\*\uffff(.+?)\*\//g,
	DOCBLOCK_START:     /\/\*\*/,
	DOCBLOCK_END:       /\*\//,
	TYPE:               /@(\w*)/,
	TYPE_PARSED:        /@[^@]*/g,
	NAME:               /(^[^\s]+)/,
	PARAM_NAME:         /[^\{]*/,
	PARAM:              /{(.*?)}/,
	PARAM_ENTRY:        /[^{}]+(?=\})/,
	PARAM_OPTIONAL:     /\[(.*?)\]/g,
	RETURN_NEWLINE:     /\r\n/g,
	NEWLINE:            /\n/g,
	STARS:              /^(\s+)?(\*|\s)[ ]?/gm,
	ALLSPACES:          /\uffff/g
});

/** string enums */
exports.STRINGS = Object.freeze({
	NEWLINE:            '\n',
	UNICODE_SPACE:      '\uffff',
	SPACE:              ' ',
	DOT:                '.',
	EMPTY_SPACE:        ''
});

/** event enums */
exports.EVENTS = Object.freeze({
	LOG_FIRED:                  'log_fired',
	PARSER_COMMENT_FOUND:       'parser_comment_found',
	PARSER_COMPLETE:            'parser_complete',
	FILTER_COMMENT_FILTERED:    'filter_comment_filtered',
	FILTER_COMPLETE:            'filter_complete',
	MAKER_SASSDOCLET_CREATED:   'sassdoclet_created',
	WORKER_COMPLETED:           'worker_completed',
	PROCESSOR_FILE_QUEUED:      'processor_file_queued',
	PROCESSOR_FILE_COMPLETE:    'processor_file_complete',
	PROCESSOR_COMPLETE:         'processor_complete',
	ENV_READY:                  'env context ready'
});

/** doc item valifation enums */
exports.VALIDATION = Object.freeze({
	OPTIONAL:       0,
	REQUIRED:       1,
	NOT_ALLOWED:    -1
});

/** doc item context enums */
exports.CONTEXT = Object.freeze({
	SUPPORTIVE:     0,
	FIRST_CLASS:    1
});

/** logging enums */
exports.LOGGING = Object.freeze({
	ERROR:      [0, '[ERROR]'],
	INFO:       [2, '[INFO]'],
	WARN:       [1, '[WARN]'],
	SUCCESS:    [2, '[SUCCESS]'],
	FAILURE:    [1, '[FAILURE]']
});

/** cli options enums */
exports.ENV = Object.freeze({
	PROJ_NAME:      'n',
	PROJ_LOGO:      'u',
	PROJ_DESC:      'd',
	PROJ_VERSION:   'v',
	PROJ_AUTHORS:   'a',
	PROJ_CONTRIB:   'b',
	PROJ_STATUS:    's',
	FILTER_EXCLUDE: 'x',
	FILTER_INCLUDE: 'i',
	PATH_INPUT:     '_input_',
	PATH_OUTPUT:    '_output_',
	PATH_DEST:      'o',
	PATH_TEMPLATE:  't',
	RECURSIVE:      'r',
	LOG:            'l',
	SAVE_CONFIG:    'c',
	WORKER_LIMIT:   'm',
	PREFIXED:       'p',
	VERBOSITY:      'y'
});

