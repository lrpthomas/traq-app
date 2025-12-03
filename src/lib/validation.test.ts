import { describe, it, expect } from 'vitest'
import {
  percentageSchema,
  headerInfoSchema,
  targetAssessmentSchema,
  validateHeaderInfo,
  getValidationErrors,
  isValidPercentage,
  validateFoliagePercentages,
} from './validation'

describe('validation', () => {
  describe('percentageSchema', () => {
    it('accepts null', () => {
      const result = percentageSchema.safeParse(null)
      expect(result.success).toBe(true)
    })

    it('accepts 0', () => {
      const result = percentageSchema.safeParse(0)
      expect(result.success).toBe(true)
    })

    it('accepts 100', () => {
      const result = percentageSchema.safeParse(100)
      expect(result.success).toBe(true)
    })

    it('accepts values between 0 and 100', () => {
      const result = percentageSchema.safeParse(50)
      expect(result.success).toBe(true)
    })

    it('rejects negative values', () => {
      const result = percentageSchema.safeParse(-1)
      expect(result.success).toBe(false)
    })

    it('rejects values over 100', () => {
      const result = percentageSchema.safeParse(101)
      expect(result.success).toBe(false)
    })
  })

  describe('headerInfoSchema', () => {
    const validHeader = {
      client: 'Test Client',
      date: '2025-01-15',
      time: '10:00',
      addressTreeLocation: '123 Main St',
      treeNo: 'T-001',
      sheetNumber: 1,
      sheetTotal: 1,
      treeSpecies: 'Quercus rubra',
      dbh: '24 in',
      height: '50 ft',
      crownSpreadDia: '40 ft',
      assessors: 'John Smith',
      toolsUsed: 'Mallet, binoculars',
      timeFrame: '1 year',
    }

    it('accepts valid header info', () => {
      const result = headerInfoSchema.safeParse(validHeader)
      expect(result.success).toBe(true)
    })

    it('rejects empty client', () => {
      const result = headerInfoSchema.safeParse({ ...validHeader, client: '' })
      expect(result.success).toBe(false)
    })

    it('rejects empty date', () => {
      const result = headerInfoSchema.safeParse({ ...validHeader, date: '' })
      expect(result.success).toBe(false)
    })

    it('rejects empty addressTreeLocation', () => {
      const result = headerInfoSchema.safeParse({ ...validHeader, addressTreeLocation: '' })
      expect(result.success).toBe(false)
    })

    it('rejects empty assessors', () => {
      const result = headerInfoSchema.safeParse({ ...validHeader, assessors: '' })
      expect(result.success).toBe(false)
    })

    it('rejects non-positive sheetNumber', () => {
      const result = headerInfoSchema.safeParse({ ...validHeader, sheetNumber: 0 })
      expect(result.success).toBe(false)
    })
  })

  describe('targetAssessmentSchema', () => {
    const validTarget = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      targetNumber: 1,
      targetDescription: 'Sidewalk',
      targetProtection: 'None',
      targetZone: {
        withinDripLine: true,
        within1xHt: false,
        within1_5xHt: false,
      },
      occupancyRate: 3,
      practicalToMoveTarget: false,
      restrictionPractical: null,
    }

    it('accepts valid target assessment', () => {
      const result = targetAssessmentSchema.safeParse(validTarget)
      expect(result.success).toBe(true)
    })

    it('accepts occupancy rates 1-4', () => {
      ;[1, 2, 3, 4].forEach((rate) => {
        const result = targetAssessmentSchema.safeParse({
          ...validTarget,
          occupancyRate: rate,
        })
        expect(result.success).toBe(true)
      })
    })

    it('rejects invalid occupancy rate', () => {
      const result = targetAssessmentSchema.safeParse({
        ...validTarget,
        occupancyRate: 5,
      })
      expect(result.success).toBe(false)
    })

    it('accepts null occupancy rate', () => {
      const result = targetAssessmentSchema.safeParse({
        ...validTarget,
        occupancyRate: null,
      })
      expect(result.success).toBe(true)
    })

    it('accepts valid target numbers 1-4', () => {
      ;[1, 2, 3, 4].forEach((num) => {
        const result = targetAssessmentSchema.safeParse({
          ...validTarget,
          targetNumber: num,
        })
        expect(result.success).toBe(true)
      })
    })
  })

  describe('validateHeaderInfo', () => {
    it('returns success true for valid data', () => {
      const validHeader = {
        client: 'Test Client',
        date: '2025-01-15',
        time: '10:00',
        addressTreeLocation: '123 Main St',
        treeNo: 'T-001',
        sheetNumber: 1,
        sheetTotal: 1,
        treeSpecies: 'Oak',
        dbh: '24 in',
        height: '50 ft',
        crownSpreadDia: '40 ft',
        assessors: 'John Smith',
        toolsUsed: 'Mallet',
        timeFrame: '1 year',
      }
      const result = validateHeaderInfo(validHeader)
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('returns success false with errors for invalid data', () => {
      const invalidHeader = { client: '' }
      const result = validateHeaderInfo(invalidHeader)
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
    })
  })

  describe('getValidationErrors', () => {
    it('formats error messages with paths', () => {
      const invalidHeader = {
        client: '',
        date: '',
        time: '10:00',
        addressTreeLocation: '',
        treeNo: 'T-001',
        sheetNumber: 1,
        sheetTotal: 1,
        treeSpecies: 'Oak',
        dbh: '24 in',
        height: '50 ft',
        crownSpreadDia: '40 ft',
        assessors: '',
        toolsUsed: 'Mallet',
        timeFrame: '1 year',
      }
      const result = headerInfoSchema.safeParse(invalidHeader)
      if (!result.success) {
        const errors = getValidationErrors(result.error)
        expect(errors.length).toBeGreaterThan(0)
        expect(errors.some((e) => e.includes('client'))).toBe(true)
      }
    })
  })

  describe('isValidPercentage', () => {
    it('returns true for null', () => {
      expect(isValidPercentage(null)).toBe(true)
    })

    it('returns true for 0', () => {
      expect(isValidPercentage(0)).toBe(true)
    })

    it('returns true for 100', () => {
      expect(isValidPercentage(100)).toBe(true)
    })

    it('returns true for values between 0 and 100', () => {
      expect(isValidPercentage(50)).toBe(true)
    })

    it('returns false for negative values', () => {
      expect(isValidPercentage(-1)).toBe(false)
    })

    it('returns false for values over 100', () => {
      expect(isValidPercentage(101)).toBe(false)
    })
  })

  describe('validateFoliagePercentages', () => {
    it('returns true when all null', () => {
      expect(validateFoliagePercentages(null, null, null)).toBe(true)
    })

    it('returns true when sum equals 100', () => {
      expect(validateFoliagePercentages(80, 15, 5)).toBe(true)
    })

    it('returns true when sum is less than 100', () => {
      expect(validateFoliagePercentages(50, 20, 10)).toBe(true)
    })

    it('returns false when sum exceeds 100', () => {
      expect(validateFoliagePercentages(80, 15, 10)).toBe(false)
    })

    it('handles mix of null and values', () => {
      expect(validateFoliagePercentages(100, null, null)).toBe(true)
      expect(validateFoliagePercentages(null, 50, 50)).toBe(true)
    })
  })
})
