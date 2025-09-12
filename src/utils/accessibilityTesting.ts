// Accessibility testing utilities for Weekendly
export interface AccessibilityTestResult {
  test: string
  status: 'PASS' | 'FAIL' | 'WARN'
  message: string
  element?: HTMLElement
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export class AccessibilityTester {
  private results: AccessibilityTestResult[] = []

  // Test semantic HTML structure
  testSemanticHTML(container: HTMLElement = document.body): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []

    // Check for proper heading hierarchy
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let previousLevel = 0
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1))
      if (level > previousLevel + 1) {
        results.push({
          test: 'Heading Hierarchy',
          status: 'FAIL',
          message: `Heading level ${level} follows level ${previousLevel}, skipping levels`,
          element: heading as HTMLElement,
          severity: 'medium'
        })
      }
      previousLevel = level
    })

    // Check for main landmark
    const main = container.querySelector('main')
    if (!main) {
      results.push({
        test: 'Main Landmark',
        status: 'FAIL',
        message: 'No <main> element found',
        severity: 'high'
      })
    }

    // Check for navigation landmark
    const nav = container.querySelector('nav')
    if (!nav) {
      results.push({
        test: 'Navigation Landmark',
        status: 'WARN',
        message: 'No <nav> element found',
        severity: 'medium'
      })
    }

    return results
  }

  // Test ARIA attributes
  testARIA(container: HTMLElement = document.body): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []

    // Check for missing alt text on images
    const images = container.querySelectorAll('img')
    images.forEach((img) => {
      if (!img.getAttribute('alt') && !img.getAttribute('aria-label')) {
        results.push({
          test: 'Image Alt Text',
          status: 'FAIL',
          message: 'Image missing alt text or aria-label',
          element: img as HTMLElement,
          severity: 'high'
        })
      }
    })

    // Check for proper button labels
    const buttons = container.querySelectorAll('button')
    buttons.forEach((button) => {
      const hasText = button.textContent?.trim()
      const hasAriaLabel = button.getAttribute('aria-label')
      const hasAriaLabelledBy = button.getAttribute('aria-labelledby')
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
        results.push({
          test: 'Button Labels',
          status: 'FAIL',
          message: 'Button has no accessible name',
          element: button as HTMLElement,
          severity: 'critical'
        })
      }
    })

    // Check for proper form labels
    const inputs = container.querySelectorAll('input, select, textarea')
    inputs.forEach((input) => {
      const id = input.getAttribute('id')
      const hasLabel = id && container.querySelector(`label[for="${id}"]`)
      const hasAriaLabel = input.getAttribute('aria-label')
      const hasAriaLabelledBy = input.getAttribute('aria-labelledby')
      
      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        results.push({
          test: 'Form Labels',
          status: 'FAIL',
          message: 'Form control has no accessible label',
          element: input as HTMLElement,
          severity: 'critical'
        })
      }
    })

    return results
  }

  // Test keyboard navigation
  testKeyboardNavigation(container: HTMLElement = document.body): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []

    // Check for focusable elements without proper tabindex
    const focusableElements = container.querySelectorAll(
      'button, input, select, textarea, a[href], [tabindex]'
    )

    focusableElements.forEach((element) => {
      const tabIndex = element.getAttribute('tabindex')
      
      // Check for positive tabindex (anti-pattern)
      if (tabIndex && parseInt(tabIndex) > 0) {
        results.push({
          test: 'Tabindex Usage',
          status: 'WARN',
          message: 'Positive tabindex found, may disrupt natural tab order',
          element: element as HTMLElement,
          severity: 'medium'
        })
      }

      // Check if interactive elements are keyboard accessible
      if ((element.tagName === 'DIV' || element.tagName === 'SPAN') && element.getAttribute('onclick')) {
        const hasTabIndex = element.hasAttribute('tabindex')
        const hasRole = element.getAttribute('role')
        
        if (!hasTabIndex || !hasRole) {
          results.push({
            test: 'Keyboard Accessibility',
            status: 'FAIL',
            message: `Interactive ${element.tagName.toLowerCase()} missing tabindex or role`,
            element: element as HTMLElement,
            severity: 'high'
          })
        }
      }
    })

    return results
  }

  // Test color contrast
  testColorContrast(container: HTMLElement = document.body): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []

    const textElements = container.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, button, a')
    
    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element)
      const color = styles.color
      const backgroundColor = styles.backgroundColor
      
      // Skip if no background color or transparent
      if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
        return
      }

      try {
        const contrast = this.calculateContrastRatio(color, backgroundColor)
        
        if (contrast < 4.5) {
          results.push({
            test: 'Color Contrast',
            status: 'FAIL',
            message: `Contrast ratio ${contrast.toFixed(2)} is below WCAG AA standard (4.5:1)`,
            element: element as HTMLElement,
            severity: 'high'
          })
        } else if (contrast < 7) {
          results.push({
            test: 'Color Contrast',
            status: 'WARN',
            message: `Contrast ratio ${contrast.toFixed(2)} meets AA but not AAA standard`,
            element: element as HTMLElement,
            severity: 'low'
          })
        }
      } catch (error) {
        // Skip elements where contrast can't be calculated
      }
    })

    return results
  }

  // Test focus indicators
  testFocusIndicators(container: HTMLElement = document.body): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []

    const focusableElements = container.querySelectorAll(
      'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    )

    focusableElements.forEach((element) => {
      const styles = window.getComputedStyle(element, ':focus')
      const outline = styles.outline
      const boxShadow = styles.boxShadow
      
      // Check if element has visible focus indicator
      if (outline === 'none' && !boxShadow.includes('rgb')) {
        results.push({
          test: 'Focus Indicators',
          status: 'FAIL',
          message: 'Focusable element has no visible focus indicator',
          element: element as HTMLElement,
          severity: 'high'
        })
      }
    })

    return results
  }

  // Run all accessibility tests
  runAllTests(container: HTMLElement = document.body): AccessibilityTestResult[] {
    this.results = []
    
    this.results.push(...this.testSemanticHTML(container))
    this.results.push(...this.testARIA(container))
    this.results.push(...this.testKeyboardNavigation(container))
    this.results.push(...this.testColorContrast(container))
    this.results.push(...this.testFocusIndicators(container))

    return this.results
  }

  // Get test summary
  getTestSummary(): {
    total: number
    passed: number
    failed: number
    warnings: number
    critical: number
    high: number
    medium: number
    low: number
  } {
    const total = this.results.length
    const passed = this.results.filter(r => r.status === 'PASS').length
    const failed = this.results.filter(r => r.status === 'FAIL').length
    const warnings = this.results.filter(r => r.status === 'WARN').length
    
    const critical = this.results.filter(r => r.severity === 'critical').length
    const high = this.results.filter(r => r.severity === 'high').length
    const medium = this.results.filter(r => r.severity === 'medium').length
    const low = this.results.filter(r => r.severity === 'low').length

    return { total, passed, failed, warnings, critical, high, medium, low }
  }

  // Helper method to calculate contrast ratio
  private calculateContrastRatio(color1: string, color2: string): number {
    const getLuminance = (color: string): number => {
      // Convert color to RGB values
      const rgb = this.parseColor(color)
      if (!rgb) return 0

      const [r, g, b] = rgb.map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })

      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)

    return (brightest + 0.05) / (darkest + 0.05)
  }

  private parseColor(color: string): [number, number, number] | null {
    // Handle rgb() format
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (rgbMatch) {
      return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])]
    }

    // Handle rgba() format
    const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/)
    if (rgbaMatch) {
      return [parseInt(rgbaMatch[1]), parseInt(rgbaMatch[2]), parseInt(rgbaMatch[3])]
    }

    // Handle hex format
    const hexMatch = color.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    if (hexMatch) {
      return [
        parseInt(hexMatch[1], 16),
        parseInt(hexMatch[2], 16),
        parseInt(hexMatch[3], 16)
      ]
    }

    return null
  }
}

// Export singleton instance
export const accessibilityTester = new AccessibilityTester()

// Utility function to run quick accessibility check
export const runAccessibilityCheck = (container?: HTMLElement): void => {
  const results = accessibilityTester.runAllTests(container)
  const summary = accessibilityTester.getTestSummary()
  
  console.group('🔍 Accessibility Test Results')
  console.log(`Total Tests: ${summary.total}`)
  console.log(`✅ Passed: ${summary.passed}`)
  console.log(`❌ Failed: ${summary.failed}`)
  console.log(`⚠️ Warnings: ${summary.warnings}`)
  console.log(`🔴 Critical Issues: ${summary.critical}`)
  console.log(`🟠 High Priority: ${summary.high}`)
  console.log(`🟡 Medium Priority: ${summary.medium}`)
  console.log(`🟢 Low Priority: ${summary.low}`)
  
  if (results.length > 0) {
    console.table(results.map(r => ({
      Test: r.test,
      Status: r.status,
      Severity: r.severity,
      Message: r.message
    })))
  }
  
  console.groupEnd()
}
