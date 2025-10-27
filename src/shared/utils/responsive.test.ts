import {
  getCurrentBreakpoint,
  isBreakpoint,
  getResponsiveValue,
  createResponsiveClasses,
  calculateResponsiveFontSize,
  getResponsiveSpacing,
  useResponsiveValue,
  getResponsiveGridColumns,
  isTouchDevice,
  getOptimalImageSize,
  BREAKPOINTS
} from './responsive'

describe('Responsive Utilities', () => {
  describe('getCurrentBreakpoint', () => {
    it('should return wide for large screens', () => {
      expect(getCurrentBreakpoint(1500)).toBe('wide')
    })

    it('should return desktop for desktop screens', () => {
      expect(getCurrentBreakpoint(1200)).toBe('desktop')
    })

    it('should return tablet for tablet screens', () => {
      expect(getCurrentBreakpoint(800)).toBe('tablet')
    })

    it('should return mobile for small screens', () => {
      expect(getCurrentBreakpoint(400)).toBe('mobile')
    })
  })

  describe('isBreakpoint', () => {
    it('should correctly identify mobile breakpoint', () => {
      expect(isBreakpoint(400, 'mobile')).toBe(true)
      expect(isBreakpoint(800, 'mobile')).toBe(false)
    })

    it('should correctly identify tablet breakpoint', () => {
      expect(isBreakpoint(800, 'tablet')).toBe(true)
      expect(isBreakpoint(400, 'tablet')).toBe(false)
      expect(isBreakpoint(1200, 'tablet')).toBe(false)
    })

    it('should correctly identify desktop breakpoint', () => {
      expect(isBreakpoint(1200, 'desktop')).toBe(true)
      expect(isBreakpoint(800, 'desktop')).toBe(false)
      expect(isBreakpoint(1500, 'desktop')).toBe(false)
    })

    it('should correctly identify wide breakpoint', () => {
      expect(isBreakpoint(1500, 'wide')).toBe(true)
      expect(isBreakpoint(1200, 'wide')).toBe(false)
    })
  })

  describe('getResponsiveValue', () => {
    it('should return breakpoint-specific value', () => {
      const values = {
        mobile: 'small',
        tablet: 'medium',
        desktop: 'large',
        default: 'default'
      }

      expect(getResponsiveValue({ mobile: values.mobile, default: values.default })).toBe('small')
    })

    it('should return default value when no breakpoint match', () => {
      const values = {
        tablet: 'medium',
        default: 'default'
      }

      expect(getResponsiveValue({ mobile: values.tablet, default: values.default })).toBe('default')
    })
  })

  describe('createResponsiveClasses', () => {
    it('should create base class with responsive modifiers', () => {
      const result = createResponsiveClasses('card', {
        tablet: 'large',
        desktop: 'xl'
      })

      expect(result).toContain('card')
      expect(result).toContain('card--tablet-large')
      expect(result).toContain('card--desktop-xl')
    })

    it('should handle empty responsive mods', () => {
      const result = createResponsiveClasses('button', {})
      expect(result).toBe('button')
    })
  })

  describe('calculateResponsiveFontSize', () => {
    it('should calculate font size within range', () => {
      const result = calculateResponsiveFontSize(375, 1920, 14, 18, 1000)
      expect(result).toBeGreaterThan(14)
      expect(result).toBeLessThan(18)
    })

    it('should return min size for small screens', () => {
      const result = calculateResponsiveFontSize(375, 1920, 14, 18, 375)
      expect(result).toBe(14)
    })

    it('should return max size for large screens', () => {
      const result = calculateResponsiveFontSize(375, 1920, 14, 18, 1920)
      expect(result).toBe(18)
    })
  })

  describe('getResponsiveSpacing', () => {
    it('should apply multiplier for breakpoint', () => {
      const result = getResponsiveSpacing(16, 'tablet', { tablet: 1.5 })
      expect(result).toBe(24)
    })

    it('should use default multiplier', () => {
      const result = getResponsiveSpacing(16, 'mobile', { tablet: 1.5 })
      expect(result).toBe(16)
    })
  })

  describe('getResponsiveGridColumns', () => {
    it('should return correct columns for each breakpoint', () => {
      expect(getResponsiveGridColumns('mobile')).toBe(1)
      expect(getResponsiveGridColumns('tablet')).toBe(2)
      expect(getResponsiveGridColumns('desktop')).toBe(3)
      expect(getResponsiveGridColumns('wide')).toBe(4)
    })
  })

  describe('isTouchDevice', () => {
    let originalNavigator: any
    let originalWindow: any

    beforeEach(() => {
      originalNavigator = global.navigator
      originalWindow = global.window
    })

    afterEach(() => {
      global.navigator = originalNavigator
      global.window = originalWindow
    })

    it('should return true for touch devices', () => {
      global.navigator = { maxTouchPoints: 1 } as any
      expect(isTouchDevice()).toBe(true)
    })

    it('should return true for ontouchstart devices', () => {
      global.window = { ontouchstart: () => {} } as any
      expect(isTouchDevice()).toBe(true)
    })

    it('should return false for non-touch devices', () => {
      global.navigator = { maxTouchPoints: 0 } as any
      global.window = {} as any
      expect(isTouchDevice()).toBe(false)
    })
  })

  describe('getOptimalImageSize', () => {
    it('should return correct sizes for different screen widths', () => {
      expect(getOptimalImageSize(300)).toBe(480)
      expect(getOptimalImageSize(600)).toBe(768)
      expect(getOptimalImageSize(900)).toBe(1024)
      expect(getOptimalImageSize(1400)).toBe(1440)
    })
  })

  describe('useResponsiveValue', () => {
    it('should use window.innerWidth when available', () => {
      global.window = { innerWidth: 800 } as any
      const result = useResponsiveValue({
        mobile: 'mobile',
        tablet: 'tablet',
        desktop: 'desktop',
        wide: 'wide'
      })
      expect(result).toBe('tablet')
    })

    it('should fallback to desktop for SSR', () => {
      delete global.window
      const result = useResponsiveValue({
        mobile: 'mobile',
        tablet: 'tablet',
        desktop: 'desktop',
        wide: 'wide'
      })
      expect(result).toBe('desktop')
    })
  })

  describe('BREAKPOINTS', () => {
    it('should have correct breakpoint values', () => {
      expect(BREAKPOINTS.mobile).toBe(375)
      expect(BREAKPOINTS.tablet).toBe(768)
      expect(BREAKPOINTS.desktop).toBe(1024)
      expect(BREAKPOINTS.wide).toBe(1440)
    })
  })
})
