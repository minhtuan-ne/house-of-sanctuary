-- Add excerpt (nullable, safe)
ALTER TABLE "Writing" ADD COLUMN "excerpt" TEXT;

-- Add slug with a temporary default, then make unique
ALTER TABLE "Writing" ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';
UPDATE "Writing" SET "slug" = 'post-' || "id"::text WHERE "slug" = '';
ALTER TABLE "Writing" ALTER COLUMN "slug" DROP DEFAULT;
CREATE UNIQUE INDEX "Writing_slug_key" ON "Writing"("slug");
