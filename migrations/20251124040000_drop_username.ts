import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1) Drop the unique constraint on username if it exists
  try {
    await knex.schema.alterTable('users', (table) => {
      table.dropUnique(['username'], 'users_username_unique');
    });
  } catch (e) {
    console.log('users_username_unique constraint missing, skipping');
  }

  // 2) Drop the username column if it exists
  try {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('username');
    });
  } catch (e) {
    console.log('username column missing, skipping');
  }
}

export async function down(knex: Knex): Promise<void> {
  // If we ever rollback, add username back as NOT NULL + UNIQUE
  await knex.schema.alterTable('users', (table) => {
    table.string('username').notNullable().unique();
  });
}

