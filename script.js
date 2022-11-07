const config = document.querySelector('.container-calc--config');
const containerEnum = document.querySelector('.calc--enum');
const containerResult = document.querySelector('.calc--result');
const btnOperators = document.querySelectorAll('.btn-operator--config');

class Calc {
  constructor() {
    this.operations = [];
    this.lastOperation = [];
    this.isNew = false;
    config.addEventListener('click', this._updateCalc);
  }

  _updateDisplay(val) {
    if (this.isNew) this._clear();

    if (!isFinite(this.operations.at(-1))) {
      containerResult.textContent = '';
      this.operations.push('');
    }

    this.operations[this.operations.length - 1] += val;
    containerResult.textContent = this.operations.at(-1);
  }

  _clear() {
    this.operations = [];
    containerResult.textContent = '0';
    containerEnum.textContent = '';
    btnOperators.forEach(el => el.classList.remove('active'));
    this.isNew = false;
  }

  _updateOperations(val, el) {
    this.isNew = false;
    this.operations.push(val);
    btnOperators.forEach(el => el.classList.remove('active'));
    el.classList.add('active');

    containerEnum.textContent = this.operations.join(' ');
  }

  _calcOperations() {
    if (!isFinite(this.operations.at(-1))) this.operations.pop();

    if (this.isNew) this.operations.push(...this.lastOperation);

    console.log(this.operations);

    this.lastOperation = this.operations.slice(-2);
    containerEnum.textContent = this.operations.join(' ');

    while (this.operations.length > 1) {
      this.operations.forEach((val, i, arr) => {
        const numbers = [parseFloat(arr[i - 1]), parseFloat(arr[i + 1])];
        if (arr.some(operand => operand === '×' || operand === '÷')) {
          if (val === '×') {
            arr[i - 1] = numbers[0] * numbers[1];
            arr.splice(i, 2);
          }

          if (val === '÷') {
            arr[i - 1] = numbers[0] / numbers[1];
            arr.splice(i, 2);
          }
        } else {
          if (val === '+') {
            arr[i - 1] = numbers[0] + numbers[1];
            arr.splice(i, 2);
          }

          if (val === '-') {
            arr[i - 1] = numbers[0] - numbers[1];
            arr.splice(i, 2);
          }
        }
      });
    }

    this.isNew = true;
    containerResult.textContent = this.operations.join('');
    btnOperators.forEach(el => el.classList.remove('active'));
  }

  _percentage = () => {
    this.operations[0] /= 100;

    this._specialConfigDisplay();
  };

  _toggleNegative = () => {
    this.operations[this.operations.length - 1] = -parseInt(
      this.operations.at(-1)
    );

    containerResult.textContent = this.operations.at(-1);
  };

  _specialConfigDisplay = () => {
    containerEnum.textContent = '';
  };

  _updateCalc = e => {
    if (!e.target.classList.contains('btn')) return;

    const el = e.target;
    const val = e.target.textContent;

    if (isFinite(val) || val === '.') {
      this._updateDisplay(val);
      return;
    }

    if (this.operations.length === 0) return;

    if (val === '=') {
      if (this.operations.length <= 2 && !this.isNew) return;
      this._calcOperations();
      return;
    }

    if (val === 'C') {
      this._clear();
      return;
    }

    if (val === '%') {
      this._calcOperations();
      this._percentage();
      return;
    }

    if (val === '+/-') {
      if (!isFinite(this.operations.at(-1))) return;
      this._toggleNegative();
      return;
    }

    this._updateOperations(val, el);
  };
}

(function () {
  const app = new Calc();
})();
