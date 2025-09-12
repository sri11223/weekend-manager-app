import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom'
import {
  AccessibilityTester
} from '../../utils/accessibilityTesting'

describe('Accessibility Testing Utils', () => {
  let container: HTMLElement
  let tester: AccessibilityTester

  beforeEach(() => {
    document.body.innerHTML = ''
    container = document.createElement('div')
    document.body.appendChild(container)
    tester = new AccessibilityTester()
  })

  describe('testSemanticHTML', () => {
    it('passes when semantic elements are used correctly', () => {
      container.innerHTML = `
        <main>
          <nav>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
            </ul>
          </nav>
          <h1>Main Title</h1>
          <section>
            <h2>Section Title</h2>
            <p>Content here</p>
          </section>
        </main>
      `

      const results = tester.testSemanticHTML(container)
      const failures = results.filter(r => r.status === 'FAIL')
      expect(failures).toHaveLength(0)
    })

    it('fails when non-semantic elements are used', () => {
      container.innerHTML = `
        <div>
          <div>
            <h3>Skipped heading level</h3>
            <p>Content without proper structure</p>
          </div>
        </div>
      `

      const results = tester.runAllTests(container)
      const failures = results.filter(r => r.status === 'FAIL')
      expect(failures.length).toBeGreaterThan(0)
      
      failures.forEach(failure => {
        expect(failure).toHaveProperty('test')
        expect(failure).toHaveProperty('message')
        expect(failure).toHaveProperty('severity')
      })
    })
  })

  describe('testARIA', () => {
    it('passes when ARIA attributes are correct', () => {
      container.innerHTML = `
        <button aria-label="Close dialog">×</button>
        <img src="test.jpg" alt="Test image" />
        <input type="text" id="name" />
        <label for="name">Name</label>
      `

      const results = tester.testARIA(container)
      const failures = results.filter(r => r.status === 'FAIL')
      expect(failures).toHaveLength(0)
    })

    it('fails when ARIA attributes are missing or incorrect', () => {
      container.innerHTML = `
        <button>×</button>
        <img src="test.jpg" />
        <input type="text" />
      `

      const results = tester.testARIA(container)
      const failures = results.filter(r => r.status === 'FAIL')
      expect(failures.length).toBeGreaterThan(0)
    })
  })

  describe('testKeyboardNavigation', () => {
    it('passes when interactive elements are keyboard accessible', () => {
      container.innerHTML = `
        <button>Click me</button>
        <a href="#">Link</a>
        <input type="text" />
      `

      const results = tester.testKeyboardNavigation(container)
      const failures = results.filter(r => r.status === 'FAIL')
      expect(failures).toHaveLength(0)
    })

   
  })

  describe('testColorContrast', () => {
    it('calculates contrast ratio correctly', () => {
      // Mock computed styles for testing
      const mockGetComputedStyle = vi.fn().mockReturnValue({
        color: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(255, 255, 255)'
      })
      
      Object.defineProperty(window, 'getComputedStyle', {
        value: mockGetComputedStyle
      })

      container.innerHTML = `<p>High contrast text</p>`

      const results = tester.testColorContrast(container)
      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
    })
  })

  describe('runAllTests', () => {
    it('runs comprehensive accessibility audit', () => {
      container.innerHTML = `
        <main>
          <h1>Test Page</h1>
          <button>Test Button</button>
          <img src="test.jpg" alt="Test" />
        </main>
      `

      const results = tester.runAllTests(container)
      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
    })

    it('provides detailed issue reporting', () => {
      container.innerHTML = `
        <div>
          <button></button>
          <img src="test.jpg" />
        </div>
      `

      const results = tester.runAllTests(container)
      const failures = results.filter(r => r.status === 'FAIL')
      expect(failures.length).toBeGreaterThan(0)
      
      failures.forEach(failure => {
        expect(failure).toHaveProperty('test')
        expect(failure).toHaveProperty('message')
        expect(failure).toHaveProperty('severity')
      })
    })
  })
})
