
[
  "fn"
  "val"
  "type"
  "union"
  "enum"
  "extern"
  "return"
  "if"
  "elif"
  "else"
  "for"
  "in"
  "match"
  "break"
  "defer"
  "when"
  "test"
] @keyword

[
  "pub"
] @keyword.storage

[
  "pre"
  "post"
  "guarded"
  "trust"
] @keyword.special

[
  "some"
  "none"
  "ok"
  "err"
] @keyword

[
  "true"
  "false"
] @constant.builtin

(type) @type
(type_decl name: (identifier) @type)
(enum_decl (identifier) @type)
(union_decl (identifier) @type)

(fn_decl
  name: (identifier) @function)

(call_expr
  function: (identifier) @function.call)

(field_access
  field: (identifier) @function.method)

(val_decl
  name: (identifier) @variable)

(parameter
  (identifier) @variable.parameter)

(field_decl
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

"!" @operator
