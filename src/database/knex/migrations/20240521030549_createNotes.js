exports.up = (knex) =>
  knex.schema.createTable("notes", (table) => {
    table.increments("id").primary();
    table.text("title");
    table.text("content");
    table.text("authorName");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("notes");
