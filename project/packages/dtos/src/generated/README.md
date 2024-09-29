# Generated Types and Enums

This folder contains auto-generated types and enums from Supabase. Do not edit these files manually.


### Directory Structure:

```text
.
├── types/
│   ├── auth.types.ts
│   ├── questions.types.ts
│   └── ... (other .types.ts files)
├── enums/
│   ├── auth.enums.ts
│   ├── questions.enums.ts
│   └── ... (generated .enums.ts files)
└── generate-enums-script.ts (script to generate enums)
```

## Regenerating Types

To regenerate types from Supabase, run the following command for each supabase project:

```bash
npx supabase gen types typescript --project-id YOUR_SUPABASE_PROJECT_ID --schema public > packages/dtos/src/generated/types/(something).types.ts
```

## Generating Enums

After generating the `.types.ts` files, the corresponding enums can be generated automatically. The enums will be written into the `/enums` directory, with each file corresponding to its `.types.ts` counterpart.

### Steps to Generate Enums:

1. Ensure all your `.types.ts` files are located in the `/types` directory.
2. To generate enums for the corresponding `.types.ts` files, run the following command:

```bash
npx ts-node path/to/generateEnums.ts
```

This script will:
- Process all `.types.ts` files from the `/types` directory.
- Generate the corresponding `.enums.ts` files into the `/enums` directory.

## Important Notes

- Do not edit the generated files (`.types.ts` and `.enums.ts`) manually.
- Always regenerate types and enums using the above commands whenever changes are made to the database schema.
