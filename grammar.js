
module.exports = grammar({
  name: 'spectre',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($._top_level),

    _top_level: $ => choice(
      $.val_decl,
      $.fn_decl,
      $.type_decl,
      $.union_decl,
      $.enum_decl,
      $.extern_decl,
      $.test_block,
      $.when_block,
    ),

    identifier: _ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: _ => /\d+(\.\d+)?/,
    string: _ => choice(
      seq('"', repeat(/[^"]/), '"'),
      seq('`', repeat(/[^`]/), '`')
    ),

    comment: _ => token(choice(
      seq('//', /.*/),
      seq('///', /.*/)
    )),


    type: $ => choice(
      $.identifier,
      seq($.identifier, '[', $.type, ']'),
      seq('ref', $.type),
      seq('[', $.number, ']', $.identifier),
    ),


    val_decl: $ => seq(
      optional('pub'),
      'val',
      field('name', $.identifier),
      optional(seq(':', $.type)),
      '=',
      $.expression
    ),

    type_decl: $ => seq(
      optional('pub'),
      'type',
      $.identifier,
      '=',
      $.struct_body
    ),

    union_decl: $ => seq(
      optional('pub'),
      'union',
      $.identifier,
      '=',
      '{',
      sepBy1('|', $.union_variant),
      '}'
    ),

    union_variant: $ => choice(
      $.identifier,
      seq($.identifier, '(', optional(sepBy(',', $.type)), ')')
    ),

    enum_decl: $ => seq(
      optional('pub'),
      'enum',
      $.identifier,
      '=',
      '{',
      sepBy(',', $.identifier),
      '}'
    ),

    extern_decl: $ => seq(
      'extern',
      optional(seq('(', $.identifier, ')')),
      choice(
        $.fn_decl,
        $.type_decl
      )
    ),


    fn_decl: $ => seq(
      optional('pub'),
      'fn',
      optional(seq('(', $.type, ')')), // method receiver
      $.identifier,
      $.parameter_list,
      optional($.type),
      optional('!'),
      '=',
      $.block
    ),

    parameter_list: $ => seq(
      '(',
      optional(sepBy(',', $.parameter)),
      ')'
    ),

    parameter: $ => seq(
      $.identifier,
      ':',
      $.type
    ),


    struct_body: $ => seq(
      '{',
      repeat($.field_decl),
      '}'
    ),

    field_decl: $ => seq(
      $.identifier,
      ':',
      optional('mut'),
      $.type
    ),


    block: $ => seq(
      '{',
      repeat($._statement),
      '}'
    ),

    test_block: $ => seq(
      'test',
      $.block
    ),

    when_block: $ => seq(
      'when',
      $.identifier,
      $.block
    ),


    _statement: $ => choice(
      $.val_decl,
      $.return_stmt,
      $.if_stmt,
      $.for_stmt,
      $.match_stmt,
      $.expr_stmt,
      $.contract_block,
      $.defer_stmt,
      $.break_stmt
    ),

    return_stmt: $ => prec.right(seq(
      'return',
      optional($.expression)
    )),

    break_stmt: _ => 'break',

    defer_stmt: $ => seq(
      'defer',
      $.block
    ),

    expr_stmt: $ => $.expression,


    contract_block: $ => choice(
      seq('pre', $.contract_body),
      seq('post', $.contract_body),
      seq('guarded', 'pre', $.contract_body)
    ),

    contract_body: $ => seq(
      '{',
      repeat($.contract_entry),
      '}'
    ),

    contract_entry: $ => seq(
      optional(seq($.identifier, ':')),
      $.expression
    ),


    if_stmt: $ => seq(
      'if',
      optional('('),
      $.expression,
      optional(')'),
      $.block,
      repeat(seq('elif', optional('('), $.expression, optional(')'), $.block)),
      optional(seq('else', $.block))
    ),

    for_stmt: $ => choice(
      seq(
        'for',
        optional('('),
        optional($.expression),
        ';',
        optional($.expression),
        ';',
        optional($.expression),
        optional(')'),
        $.block
      ),
      seq(
        'for',
        $.identifier,
        'in',
        $.expression,
        $.block
      ),
      seq('for', $.block)
    ),

    match_stmt: $ => seq(
      'match',
      $.expression,
      '{',
      repeat($.match_arm),
      '}'
    ),

    match_arm: $ => seq(
      choice(
        seq($.pattern, '=>'),
        seq('else', '=>')
      ),
      $.block
    ),

    pattern: $ => choice(
      $.identifier,
      seq($.identifier, repeat($.identifier)),
      $.string
    ),


    expression: $ => choice(
      $.binary_expr,
      $.call_expr,
      $.field_access,
      $.literal,
      $.identifier,
      $.assignment,
      $.unary_expr,
      $.composite_literal
    ),

    literal: $ => choice(
      $.number,
      $.string,
      'true',
      'false',
      'none'
    ),


    composite_literal: $ => seq(
      '{',
      sepBy1(',', seq($.identifier, ':', $.expression)),
      optional(','),
      '}'
    ),
    assignment: $ => prec.right(1, seq(
      $.expression,
      '=',
      $.expression
    )),

    call_expr: $ => seq(
      $.expression,
      '(',
      optional(sepBy(',', $.expression)),
      ')'
    ),

    field_access: $ => seq(
      $.expression,
      '.',
      $.identifier
    ),

    unary_expr: $ => prec(11, seq(
      choice('!', '-', '@'),
      $.expression
    )),
    binary_expr: $ => choice(
      prec.left(10, seq($.expression, '*', $.expression)),
      prec.left(10, seq($.expression, '/', $.expression)),

      prec.left(9, seq($.expression, '+', $.expression)),
      prec.left(9, seq($.expression, '-', $.expression)),

      prec.left(8, seq($.expression, '<', $.expression)),
      prec.left(8, seq($.expression, '>', $.expression)),
      prec.left(8, seq($.expression, '<=', $.expression)),
      prec.left(8, seq($.expression, '>=', $.expression)),

      prec.left(7, seq($.expression, '==', $.expression)),
      prec.left(7, seq($.expression, '!=', $.expression)),

      prec.left(6, seq($.expression, '&&', $.expression)),
      prec.left(5, seq($.expression, '||', $.expression)),
    ),
  }
});

function sepBy(sep, rule) {
  return optional(sepBy1(sep, rule));
}

function sepBy1(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)));
}
