import {Component} from '@angular/core'

@Component({
  selector: 'ngx-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent {
  expression: string = ''
  buttonRows: string[][] = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '%', '+'],
    ['C', '=']
  ]

  addToExpression(value: string) {
    if (value === '=') {
      this.evaluateExpression()
    } else if (value === 'C') {
      this.clearExpression()
    } else {
      this.expression += value
    }
  }

  evaluateExpression() {
    try {
      // eslint-disable-next-line no-eval
      this.expression = eval(this.expression)
    } catch (error) {
      this.expression = 'Error'
      setTimeout(() => {
        this.expression = ''
      }, 2000)
    }
  }

  clearExpression() {
    this.expression = ''
  }

  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = /^[0-9.\-+/*\s\b]$/

    if (event.key === 'Enter') {
      event.preventDefault() // Prevent the default Enter behavior (e.g., form submission)
      this.evaluateExpression()
    } else if (event.key === 'Backspace') {
      // Remove the last character from the expression
      this.expression = this.expression.slice(0, -1)
    } else if (!allowedKeys.test(event.key)) {
      event.preventDefault()
    }
  }
}
