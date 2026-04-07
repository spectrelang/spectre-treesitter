((identifier) @keyword
  (#match? @keyword "^(fn|val|type|union|enum|extern|return|if|elif|else|for|in|match|break|defer|when|test|pub)$"))

((identifier) @keyword.special
  (#match? @keyword.special "^(pre|post|guarded|trust)$"))

((identifier) @constant.builtin
  (#match? @constant.builtin "^(true|false|none)$"))

((identifier) @keyword
  (#match? @keyword "^(some|ok|err)$"))

(fn_decl
  (identifier) @function)

(type) @type

(type_decl
  (identifier) @type)

(enum_decl
  (identifier) @type)

(union_decl
  (identifier) @type)


(val_decl
  (identifier) @variable)

(parameter
  (identifier) @variable.parameter)

(field_decl
  (identifier) @property)


(field_access
  (identifier) @property)


(pattern
  (identifier) @constant)

(number) @constant.numeric
(string) @string


(comment) @comment


[
  "+"
  "-"
  "*"
  "/"
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "&&"
  "||"
  "="
] @operator

"!" @operator

[
  "("
  ")"
  "{"
  "}"
  "["
  "]"
] @punctuation.bracket

[
  ","
  "."
  ":"
  ";"
] @punctuation.delimiter


(unary_expr
  "@" @function.builtin)
