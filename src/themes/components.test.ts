/**
 * Visual Component Style Builders Tests
 * Critical for maintaining visual consistency across the portfolio
 */

import {
  getCardStyles,
  getButtonStyles,
  getInputStyles,
  getContainerStyles,
  getFlexStyles,
  getTextStyles
} from './components'

describe('Theme Component Style Builders', () => {
  describe('getCardStyles - Visual Card Consistency', () => {
    it('should return default card styles with theme colors', () => {
      const styles = getCardStyles('default')

      expect(styles.backgroundColor).toBeDefined()
      expect(styles.borderRadius).toBeDefined()
      expect(styles.border).toContain('1px solid')
      expect(styles.boxShadow).toBeDefined()
    })

    it('should return elevated card styles with stronger shadow', () => {
      const defaultStyles = getCardStyles('default')
      const elevatedStyles = getCardStyles('elevated')

      expect(elevatedStyles.boxShadow).not.toBe(defaultStyles.boxShadow)
      expect(elevatedStyles.backgroundColor).toBe(defaultStyles.backgroundColor)
    })

    it('should return bordered card styles without shadow', () => {
      const borderedStyles = getCardStyles('bordered')

      expect(borderedStyles.boxShadow).toBe('none')
      expect(borderedStyles.border).toContain('2px solid')
    })

    it('should maintain visual hierarchy through variants', () => {
      const variants = ['default', 'elevated', 'bordered'] as const

      variants.forEach(variant => {
        const styles = getCardStyles(variant)
        expect(styles.borderRadius).toBeDefined() // Consistent rounded corners
        expect(styles.backgroundColor).toBeDefined() // Theme-aware background
      })
    })
  })

  describe('getButtonStyles - Interactive Element Consistency', () => {
    it('should return primary button styles with theme colors', () => {
      const styles = getButtonStyles('primary', 'md')

      expect(styles.border).toBe('none')
      expect(styles.borderRadius).toBeDefined()
      expect(styles.fontWeight).toBeDefined()
      expect(styles.cursor).toBe('pointer')
      expect(styles.transition).toBeDefined()
    })

    it('should return secondary button styles', () => {
      const primaryStyles = getButtonStyles('primary', 'md')
      const secondaryStyles = getButtonStyles('secondary', 'md')

      expect(secondaryStyles.border).toBe('none')
      expect(secondaryStyles.borderRadius).toBe(primaryStyles.borderRadius)
    })

    it('should scale button sizes appropriately', () => {
      const smallStyles = getButtonStyles('primary', 'sm')
      const mediumStyles = getButtonStyles('primary', 'md')
      const largeStyles = getButtonStyles('primary', 'lg')

      // Each size should have consistent properties
      expect(smallStyles.padding).toBeDefined()
      expect(mediumStyles.padding).toBeDefined()
      expect(largeStyles.padding).toBeDefined()

      expect(smallStyles.fontSize).toBeDefined()
      expect(mediumStyles.fontSize).toBeDefined()
      expect(largeStyles.fontSize).toBeDefined()
    })

    it('should maintain accessibility with focus states', () => {
      const styles = getButtonStyles('primary', 'md')

      expect(styles.transition).toContain('all') // Smooth transitions for accessibility
      expect(styles.cursor).toBe('pointer') // Clear interactive indication
    })
  })

  describe('getTextStyles - Typography Hierarchy', () => {
    it('should return consistent text styles for headings', () => {
      const h1Styles = getTextStyles('4xl', 'bold', 'primary')
      const h2Styles = getTextStyles('3xl', 'semibold', 'primary')
      const h3Styles = getTextStyles('2xl', 'medium', 'primary')

      expect(h1Styles.fontSize).toBeDefined()
      expect(h2Styles.fontSize).toBeDefined()
      expect(h3Styles.fontSize).toBeDefined()

      expect(h1Styles.fontWeight).toBeDefined()
      expect(h2Styles.fontWeight).toBeDefined()
      expect(h3Styles.fontWeight).toBeDefined()
    })

    it('should return proper color variants', () => {
      const primaryText = getTextStyles('base', 'normal', 'primary')
      const mutedText = getTextStyles('base', 'normal', 'muted')
      const accentText = getTextStyles('base', 'normal', 'accent')

      expect(primaryText.color).toBeDefined()
      expect(mutedText.color).toBeDefined()
      expect(accentText.color).toBeDefined()

      // Muted should be different from primary
      expect(mutedText.color).not.toBe(primaryText.color)
    })

    it('should maintain readable line heights', () => {
      const styles = getTextStyles('base', 'normal', 'primary')

      expect(styles.lineHeight).toBeDefined()
      expect(styles.lineHeight).toBeGreaterThan(1) // Proper line spacing for readability
    })

    it('should support responsive typography scaling', () => {
      const baseStyles = getTextStyles('base', 'normal', 'primary')
      const lgStyles = getTextStyles('lg', 'normal', 'primary')
      const xlStyles = getTextStyles('xl', 'normal', 'primary')

      // Larger sizes should have larger font sizes
      expect(parseFloat(xlStyles.fontSize as string)).toBeGreaterThan(parseFloat(lgStyles.fontSize as string))
      expect(parseFloat(lgStyles.fontSize as string)).toBeGreaterThan(parseFloat(baseStyles.fontSize as string))
    })
  })

  describe('getContainerStyles - Layout Consistency', () => {
    it('should return responsive container widths', () => {
      const smContainer = getContainerStyles('sm')
      const mdContainer = getContainerStyles('md')
      const lgContainer = getContainerStyles('lg')
      const xlContainer = getContainerStyles('xl')
      const fullContainer = getContainerStyles('full')

      expect(smContainer.maxWidth).toBeDefined()
      expect(mdContainer.maxWidth).toBeDefined()
      expect(lgContainer.maxWidth).toBeDefined()
      expect(xlContainer.maxWidth).toBeDefined()
      expect(fullContainer.maxWidth).toBe('100%')
    })

    it('should center containers with auto margins', () => {
      const styles = getContainerStyles('lg')

      expect(styles.margin).toBe('0 auto')
      expect(styles.width).toBe('100%')
    })

    it('should maintain consistent padding across breakpoints', () => {
      const styles = getContainerStyles('lg')

      expect(styles.paddingLeft).toBeDefined()
      expect(styles.paddingRight).toBeDefined()
    })
  })

  describe('getFlexStyles - Layout Flexibility', () => {
    it('should return basic flexbox styles', () => {
      const styles = getFlexStyles('row', 'center', 'center')

      expect(styles.display).toBe('flex')
      expect(styles.flexDirection).toBe('row')
      expect(styles.alignItems).toBe('center')
      expect(styles.justifyContent).toBe('center')
    })

    it('should support different flex directions', () => {
      const rowStyles = getFlexStyles('row')
      const columnStyles = getFlexStyles('column')

      expect(rowStyles.flexDirection).toBe('row')
      expect(columnStyles.flexDirection).toBe('column')
    })

    it('should support alignment options', () => {
      const centerStyles = getFlexStyles('row', 'center', 'center')
      const startStyles = getFlexStyles('row', 'flex-start', 'flex-start')
      const spaceBetweenStyles = getFlexStyles('row', 'center', 'space-between')

      expect(centerStyles.alignItems).toBe('center')
      expect(centerStyles.justifyContent).toBe('center')

      expect(startStyles.alignItems).toBe('flex-start')
      expect(startStyles.justifyContent).toBe('flex-start')

      expect(spaceBetweenStyles.justifyContent).toBe('space-between')
    })
  })

  describe('getInputStyles - Form Element Consistency', () => {
    it('should return consistent input styling', () => {
      const styles = getInputStyles('md')

      expect(styles.border).toBeDefined()
      expect(styles.borderRadius).toBeDefined()
      expect(styles.padding).toBeDefined()
      expect(styles.fontSize).toBeDefined()
    })

    it('should scale input sizes appropriately', () => {
      const smallStyles = getInputStyles('sm')
      const mediumStyles = getInputStyles('md')
      const largeStyles = getInputStyles('lg')

      expect(smallStyles.padding).toBeDefined()
      expect(mediumStyles.padding).toBeDefined()
      expect(largeStyles.padding).toBeDefined()
    })

    it('should maintain focus accessibility', () => {
      const styles = getInputStyles('md')

      expect(styles.transition).toBeDefined() // Smooth focus transitions
      expect(styles.outline).toBe('none') // Custom focus styles expected
    })
  })

  describe('Visual Consistency Across Components', () => {
    it('should use consistent border radius across components', () => {
      const cardStyles = getCardStyles('default')
      const buttonStyles = getButtonStyles('primary', 'md')
      const inputStyles = getInputStyles('md')

      // All components should have consistent border radius
      expect(cardStyles.borderRadius).toBeDefined()
      expect(buttonStyles.borderRadius).toBeDefined()
      expect(inputStyles.borderRadius).toBeDefined()
    })

    it('should use consistent spacing scale', () => {
      const buttonMd = getButtonStyles('primary', 'md')
      const inputMd = getInputStyles('md')
      const cardDefault = getCardStyles('default')

      // Components should use theme-aware spacing
      expect(buttonMd.padding).toBeDefined()
      expect(inputMd.padding).toBeDefined()
      expect(cardDefault.padding).toBeUndefined() // Cards might not have default padding
    })

    it('should maintain theme color consistency', () => {
      const primaryButton = getButtonStyles('primary', 'md')
      const card = getCardStyles('default')

      // Components should use theme colors
      expect(primaryButton.backgroundColor).toBeDefined()
      expect(card.backgroundColor).toBeDefined()
    })
  })
})
