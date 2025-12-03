import { describe, it, expect } from 'vitest'
import {
  calculateFailureAndImpact,
  calculateRiskRating,
  calculateFullRisk,
  getOverallRiskRating,
  RISK_COLORS,
  LABELS,
  RISK_DESCRIPTIONS,
} from './riskMatrix'
import type {
  LikelihoodOfImpact,
  FailureAndImpact,
  Consequences,
  RiskRating,
} from '@/types/traq'

describe('riskMatrix', () => {
  describe('calculateFailureAndImpact (Matrix 1)', () => {
    it('returns null when likelihoodOfFailure is null', () => {
      expect(calculateFailureAndImpact(null, 'high')).toBeNull()
    })

    it('returns null when likelihoodOfImpact is null', () => {
      expect(calculateFailureAndImpact('imminent', null)).toBeNull()
    })

    it('returns null when both inputs are null', () => {
      expect(calculateFailureAndImpact(null, null)).toBeNull()
    })

    // Test all imminent combinations
    describe('imminent failure likelihood', () => {
      it('imminent + very-low = unlikely', () => {
        expect(calculateFailureAndImpact('imminent', 'very-low')).toBe('unlikely')
      })

      it('imminent + low = somewhat', () => {
        expect(calculateFailureAndImpact('imminent', 'low')).toBe('somewhat')
      })

      it('imminent + medium = likely', () => {
        expect(calculateFailureAndImpact('imminent', 'medium')).toBe('likely')
      })

      it('imminent + high = very-likely', () => {
        expect(calculateFailureAndImpact('imminent', 'high')).toBe('very-likely')
      })
    })

    // Test all probable combinations
    describe('probable failure likelihood', () => {
      it('probable + very-low = unlikely', () => {
        expect(calculateFailureAndImpact('probable', 'very-low')).toBe('unlikely')
      })

      it('probable + low = unlikely', () => {
        expect(calculateFailureAndImpact('probable', 'low')).toBe('unlikely')
      })

      it('probable + medium = somewhat', () => {
        expect(calculateFailureAndImpact('probable', 'medium')).toBe('somewhat')
      })

      it('probable + high = likely', () => {
        expect(calculateFailureAndImpact('probable', 'high')).toBe('likely')
      })
    })

    // Test all possible combinations
    describe('possible failure likelihood', () => {
      it('possible + very-low = unlikely', () => {
        expect(calculateFailureAndImpact('possible', 'very-low')).toBe('unlikely')
      })

      it('possible + low = unlikely', () => {
        expect(calculateFailureAndImpact('possible', 'low')).toBe('unlikely')
      })

      it('possible + medium = unlikely', () => {
        expect(calculateFailureAndImpact('possible', 'medium')).toBe('unlikely')
      })

      it('possible + high = somewhat', () => {
        expect(calculateFailureAndImpact('possible', 'high')).toBe('somewhat')
      })
    })

    // Test all improbable combinations
    describe('improbable failure likelihood', () => {
      it('improbable + any impact = unlikely', () => {
        const impacts: LikelihoodOfImpact[] = ['very-low', 'low', 'medium', 'high']
        impacts.forEach((impact) => {
          expect(calculateFailureAndImpact('improbable', impact)).toBe('unlikely')
        })
      })
    })
  })

  describe('calculateRiskRating (Matrix 2)', () => {
    it('returns null when failureAndImpact is null', () => {
      expect(calculateRiskRating(null, 'severe')).toBeNull()
    })

    it('returns null when consequences is null', () => {
      expect(calculateRiskRating('very-likely', null)).toBeNull()
    })

    it('returns null when both inputs are null', () => {
      expect(calculateRiskRating(null, null)).toBeNull()
    })

    // Test very-likely combinations
    describe('very-likely failure & impact', () => {
      it('very-likely + negligible = low', () => {
        expect(calculateRiskRating('very-likely', 'negligible')).toBe('low')
      })

      it('very-likely + minor = moderate', () => {
        expect(calculateRiskRating('very-likely', 'minor')).toBe('moderate')
      })

      it('very-likely + significant = high', () => {
        expect(calculateRiskRating('very-likely', 'significant')).toBe('high')
      })

      it('very-likely + severe = extreme', () => {
        expect(calculateRiskRating('very-likely', 'severe')).toBe('extreme')
      })
    })

    // Test likely combinations
    describe('likely failure & impact', () => {
      it('likely + negligible = low', () => {
        expect(calculateRiskRating('likely', 'negligible')).toBe('low')
      })

      it('likely + minor = moderate', () => {
        expect(calculateRiskRating('likely', 'minor')).toBe('moderate')
      })

      it('likely + significant = high', () => {
        expect(calculateRiskRating('likely', 'significant')).toBe('high')
      })

      it('likely + severe = high', () => {
        expect(calculateRiskRating('likely', 'severe')).toBe('high')
      })
    })

    // Test somewhat combinations
    describe('somewhat failure & impact', () => {
      it('somewhat + negligible = low', () => {
        expect(calculateRiskRating('somewhat', 'negligible')).toBe('low')
      })

      it('somewhat + minor = low', () => {
        expect(calculateRiskRating('somewhat', 'minor')).toBe('low')
      })

      it('somewhat + significant = moderate', () => {
        expect(calculateRiskRating('somewhat', 'significant')).toBe('moderate')
      })

      it('somewhat + severe = moderate', () => {
        expect(calculateRiskRating('somewhat', 'severe')).toBe('moderate')
      })
    })

    // Test unlikely combinations
    describe('unlikely failure & impact', () => {
      it('unlikely + any consequence = low', () => {
        const consequences: Consequences[] = ['negligible', 'minor', 'significant', 'severe']
        consequences.forEach((consequence) => {
          expect(calculateRiskRating('unlikely', consequence)).toBe('low')
        })
      })
    })
  })

  describe('calculateFullRisk', () => {
    it('returns both null values when inputs are null', () => {
      const result = calculateFullRisk(null, null, null)
      expect(result.failureAndImpact).toBeNull()
      expect(result.riskRating).toBeNull()
    })

    it('calculates failure and impact but not risk rating when consequences is null', () => {
      const result = calculateFullRisk('imminent', 'high', null)
      expect(result.failureAndImpact).toBe('very-likely')
      expect(result.riskRating).toBeNull()
    })

    it('calculates complete risk for extreme scenario', () => {
      // Imminent failure + high impact = very-likely
      // very-likely + severe consequences = extreme
      const result = calculateFullRisk('imminent', 'high', 'severe')
      expect(result.failureAndImpact).toBe('very-likely')
      expect(result.riskRating).toBe('extreme')
    })

    it('calculates complete risk for low scenario', () => {
      // Improbable failure + very-low impact = unlikely
      // unlikely + negligible consequences = low
      const result = calculateFullRisk('improbable', 'very-low', 'negligible')
      expect(result.failureAndImpact).toBe('unlikely')
      expect(result.riskRating).toBe('low')
    })

    it('calculates complete risk for moderate scenario', () => {
      // Probable failure + medium impact = somewhat
      // somewhat + significant consequences = moderate
      const result = calculateFullRisk('probable', 'medium', 'significant')
      expect(result.failureAndImpact).toBe('somewhat')
      expect(result.riskRating).toBe('moderate')
    })
  })

  describe('getOverallRiskRating', () => {
    it('returns null for empty array', () => {
      expect(getOverallRiskRating([])).toBeNull()
    })

    it('returns null for array of only nulls', () => {
      expect(getOverallRiskRating([null, null, null])).toBeNull()
    })

    it('returns the only non-null value', () => {
      expect(getOverallRiskRating([null, 'moderate', null])).toBe('moderate')
    })

    it('returns extreme as highest', () => {
      expect(getOverallRiskRating(['low', 'moderate', 'high', 'extreme'])).toBe('extreme')
    })

    it('returns high when extreme is not present', () => {
      expect(getOverallRiskRating(['low', 'moderate', 'high'])).toBe('high')
    })

    it('returns moderate when high/extreme are not present', () => {
      expect(getOverallRiskRating(['low', 'moderate', 'low'])).toBe('moderate')
    })

    it('returns low when only low values present', () => {
      expect(getOverallRiskRating(['low', 'low', 'low'])).toBe('low')
    })

    it('handles mixed null and valid values', () => {
      expect(getOverallRiskRating([null, 'low', null, 'high', null])).toBe('high')
    })
  })

  describe('RISK_COLORS', () => {
    it('has colors for all risk ratings', () => {
      const ratings: RiskRating[] = ['low', 'moderate', 'high', 'extreme']
      ratings.forEach((rating) => {
        expect(RISK_COLORS[rating]).toBeDefined()
        expect(RISK_COLORS[rating].bg).toBeDefined()
        expect(RISK_COLORS[rating].text).toBeDefined()
        expect(RISK_COLORS[rating].border).toBeDefined()
      })
    })

    it('uses appropriate color scheme', () => {
      expect(RISK_COLORS.low.bg).toContain('green')
      expect(RISK_COLORS.moderate.bg).toContain('yellow')
      expect(RISK_COLORS.high.bg).toContain('orange')
      expect(RISK_COLORS.extreme.bg).toContain('red')
    })
  })

  describe('LABELS', () => {
    it('has labels for likelihood of failure', () => {
      expect(LABELS.likelihoodOfFailure.improbable).toBe('Improbable')
      expect(LABELS.likelihoodOfFailure.possible).toBe('Possible')
      expect(LABELS.likelihoodOfFailure.probable).toBe('Probable')
      expect(LABELS.likelihoodOfFailure.imminent).toBe('Imminent')
    })

    it('has labels for likelihood of impact', () => {
      expect(LABELS.likelihoodOfImpact['very-low']).toBe('Very low')
      expect(LABELS.likelihoodOfImpact.low).toBe('Low')
      expect(LABELS.likelihoodOfImpact.medium).toBe('Medium')
      expect(LABELS.likelihoodOfImpact.high).toBe('High')
    })

    it('has labels for failure and impact', () => {
      expect(LABELS.failureAndImpact.unlikely).toBe('Unlikely')
      expect(LABELS.failureAndImpact.somewhat).toBe('Somewhat likely')
      expect(LABELS.failureAndImpact.likely).toBe('Likely')
      expect(LABELS.failureAndImpact['very-likely']).toBe('Very likely')
    })

    it('has labels for consequences', () => {
      expect(LABELS.consequences.negligible).toBe('Negligible')
      expect(LABELS.consequences.minor).toBe('Minor')
      expect(LABELS.consequences.significant).toBe('Significant')
      expect(LABELS.consequences.severe).toBe('Severe')
    })

    it('has labels for risk ratings', () => {
      expect(LABELS.riskRating.low).toBe('Low')
      expect(LABELS.riskRating.moderate).toBe('Moderate')
      expect(LABELS.riskRating.high).toBe('High')
      expect(LABELS.riskRating.extreme).toBe('Extreme')
    })
  })

  describe('RISK_DESCRIPTIONS', () => {
    it('has descriptions for all risk ratings', () => {
      const ratings: RiskRating[] = ['low', 'moderate', 'high', 'extreme']
      ratings.forEach((rating) => {
        expect(RISK_DESCRIPTIONS[rating]).toBeDefined()
        expect(typeof RISK_DESCRIPTIONS[rating]).toBe('string')
        expect(RISK_DESCRIPTIONS[rating].length).toBeGreaterThan(0)
      })
    })
  })

  // Edge case testing for ISA form compliance
  describe('ISA Form Compliance', () => {
    it('extreme risk only occurs with very-likely + severe', () => {
      // Only very-likely failure & impact combined with severe consequences
      // should result in extreme risk
      const failureAndImpactValues: FailureAndImpact[] = ['unlikely', 'somewhat', 'likely', 'very-likely']
      const consequencesValues: Consequences[] = ['negligible', 'minor', 'significant', 'severe']

      let extremeCount = 0
      failureAndImpactValues.forEach((fi) => {
        consequencesValues.forEach((c) => {
          if (calculateRiskRating(fi, c) === 'extreme') {
            extremeCount++
          }
        })
      })

      // Per ISA matrix, only very-likely + severe = extreme
      expect(extremeCount).toBe(1)
      expect(calculateRiskRating('very-likely', 'severe')).toBe('extreme')
    })

    it('low risk can occur with any failure & impact level given negligible consequences', () => {
      const failureAndImpactValues: FailureAndImpact[] = ['unlikely', 'somewhat', 'likely', 'very-likely']
      failureAndImpactValues.forEach((fi) => {
        expect(calculateRiskRating(fi, 'negligible')).toBe('low')
      })
    })
  })
})
