-- CreateEnum
CREATE TYPE "SurebetType" AS ENUM ('LIVE', 'PREMATCH');

-- CreateEnum
CREATE TYPE "RegisteredSurebetStatus" AS ENUM ('PENDING', 'GREEN', 'RED', 'VOID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SurebetLegResult" AS ENUM ('PENDING', 'GREEN', 'RED', 'VOID', 'CANCELLED');

-- CreateTable
CREATE TABLE "bookmakers" (
    "id" TEXT NOT NULL,
    "external_bookmaker_id" INTEGER NOT NULL,
    "clone_id" INTEGER,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "domain" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "raw_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookmakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports" (
    "id" TEXT NOT NULL,
    "external_sport_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "category_id" INTEGER,
    "category_name" TEXT,
    "raw_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_types" (
    "id" TEXT NOT NULL,
    "external_market_type_id" INTEGER NOT NULL,
    "name_template" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registered_surebets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "arb_hash" TEXT NOT NULL,
    "external_event_id" BIGINT NOT NULL,
    "type" "SurebetType" NOT NULL,
    "percent" DECIMAL(10,4),
    "arb_type" TEXT,
    "min_koef" DECIMAL(10,4),
    "max_koef" DECIMAL(10,4),
    "event_name" TEXT NOT NULL,
    "league_name" TEXT,
    "sport_id" INTEGER,
    "sport_name" TEXT,
    "team1_name" TEXT,
    "team2_name" TEXT,
    "current_score_when_registered" TEXT,
    "status" "RegisteredSurebetStatus" NOT NULL DEFAULT 'PENDING',
    "raw_snapshot" JSONB,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registered_surebets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registered_surebet_legs" (
    "id" TEXT NOT NULL,
    "registered_surebet_id" TEXT NOT NULL,
    "leg_index" INTEGER NOT NULL,
    "external_bet_id" TEXT NOT NULL,
    "external_bookmaker_id" INTEGER,
    "bookmaker_name" TEXT NOT NULL,
    "bookmaker_url" TEXT,
    "odd" DECIMAL(10,4) NOT NULL,
    "market_type_id" INTEGER,
    "market_name" TEXT NOT NULL,
    "market_param" DECIMAL(10,4),
    "result" "SurebetLegResult" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registered_surebet_legs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookmakers_external_bookmaker_id_key" ON "bookmakers"("external_bookmaker_id");

-- CreateIndex
CREATE INDEX "bookmakers_name_idx" ON "bookmakers"("name");

-- CreateIndex
CREATE INDEX "bookmakers_clone_id_idx" ON "bookmakers"("clone_id");

-- CreateIndex
CREATE UNIQUE INDEX "sports_external_sport_id_key" ON "sports"("external_sport_id");

-- CreateIndex
CREATE INDEX "sports_name_idx" ON "sports"("name");

-- CreateIndex
CREATE UNIQUE INDEX "market_types_external_market_type_id_key" ON "market_types"("external_market_type_id");

-- CreateIndex
CREATE INDEX "market_types_name_template_idx" ON "market_types"("name_template");

-- CreateIndex
CREATE INDEX "registered_surebets_user_id_registered_at_idx" ON "registered_surebets"("user_id", "registered_at");

-- CreateIndex
CREATE INDEX "registered_surebets_user_id_status_idx" ON "registered_surebets"("user_id", "status");

-- CreateIndex
CREATE INDEX "registered_surebets_arb_hash_idx" ON "registered_surebets"("arb_hash");

-- CreateIndex
CREATE INDEX "registered_surebets_external_event_id_idx" ON "registered_surebets"("external_event_id");

-- CreateIndex
CREATE INDEX "registered_surebets_type_idx" ON "registered_surebets"("type");

-- CreateIndex
CREATE INDEX "registered_surebets_registered_at_idx" ON "registered_surebets"("registered_at");

-- CreateIndex
CREATE INDEX "registered_surebet_legs_registered_surebet_id_idx" ON "registered_surebet_legs"("registered_surebet_id");

-- CreateIndex
CREATE INDEX "registered_surebet_legs_result_idx" ON "registered_surebet_legs"("result");

-- CreateIndex
CREATE INDEX "registered_surebet_legs_external_bookmaker_id_idx" ON "registered_surebet_legs"("external_bookmaker_id");

-- CreateIndex
CREATE INDEX "registered_surebet_legs_market_type_id_idx" ON "registered_surebet_legs"("market_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "registered_surebet_legs_registered_surebet_id_leg_index_key" ON "registered_surebet_legs"("registered_surebet_id", "leg_index");

-- AddForeignKey
ALTER TABLE "registered_surebets" ADD CONSTRAINT "registered_surebets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registered_surebet_legs" ADD CONSTRAINT "registered_surebet_legs_registered_surebet_id_fkey" FOREIGN KEY ("registered_surebet_id") REFERENCES "registered_surebets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
