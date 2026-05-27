import { NormalizedMarket } from '../../application/contracts/normalized-surebet';

export interface MarketResolution {
  market: NormalizedMarket;
  missing: boolean;
}

/**
 * Resolves a leg's market name from the catalog template. If the template
 * contains `%s`, it is replaced with the raw market_and_bet_type_param. Falls
 * back to `Market #<id>` (flagged missing) when the template is unknown.
 */
export class MarketNameResolver {
  resolve(
    marketTypeId: number | null,
    rawParam: number | string | null,
    templatesById: Map<number, string>,
  ): MarketResolution {
    const param = this.toNumber(rawParam);

    if (marketTypeId == null) {
      return {
        market: { marketTypeId: null, name: 'Market', param },
        missing: true,
      };
    }

    const template = templatesById.get(marketTypeId);
    if (!template) {
      return {
        market: { marketTypeId, name: `Market #${marketTypeId}`, param },
        missing: true,
      };
    }

    const name = template.includes('%s')
      ? template.replace('%s', this.formatParam(rawParam))
      : template;

    return { market: { marketTypeId, name, param }, missing: false };
  }

  private formatParam(rawParam: number | string | null): string {
    if (rawParam == null) {
      return '';
    }
    return String(rawParam);
  }

  private toNumber(value: number | string | null | undefined): number | null {
    if (value == null) {
      return null;
    }
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
