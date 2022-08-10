#! /usr/bin/env node

// TODO: Standardize paths everywhere

import { program } from 'commander';
import list_created_blocks from './commands/list_created_blocks.js';
import list_available_fields from './commands/list_available_fields.js';
import generate_field_schema from './commands/generate_field_schema.js';
import create_new_block from './commands/create_new_block.js';
import remove_existing_block from './commands/remove_existing_block.js';
import { help } from './CONFIG.js';
import rename_existing_block from './commands/rename_existing_block.js';
import copy_existing_block from './commands/copy_existing_block.js';

program.command('list').description(help.list).action(list_created_blocks);

program
  .command('fields_list')
  .description(help.fields_list)
  .action(list_available_fields);

program
  .command('schema <field_type> [field_name]')
  .description(help.schema)
  .action(generate_field_schema);

program
  .command('add <block-name-kebab-case>')
  .description(help.add)
  .action(create_new_block);

program
  .command('rename <block-name> <block-new-name>')
  .description(help.rename)
  .action(rename_existing_block);

program
  .command('copy <block-name> <new-block-name>')
  .description(help.copy)
  .action(copy_existing_block);

program
  .command('remove <block-name-kebab-case>')
  .description(help.remove)
  .action(remove_existing_block);

// program.command('new').description(help.new).action(try_create_new_block);

program.parse();
