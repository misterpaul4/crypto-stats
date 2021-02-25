import { to2Decimal, toDecimal, moneyWithCommas } from '../index';

describe('formating number into 2 decimals', () => {
  it('should format a number to 2 decimals', () => {
    const sample = '55.7485';
    expect(to2Decimal(sample)).toBe('55.75');
    expect(to2Decimal(sample)).not.toBe(sample);
  });

  it('return a string', () => {
    const sample = 55.57485;
    const format = to2Decimal(sample);
    expect(typeof format).toBe('string');
    expect(typeof format).not.toBe('number');
  });

  it('should not format if the expected value is 0.00', () => {
    const sample = '0.000005';
    expect(to2Decimal(sample)).toBe(sample);
    expect(to2Decimal(sample)).not.toBe('0.00');
  });
});

describe('Adding Commas to numbers', () => {
  it('add commas to number after every hundred', () => {
    const sample = '58957447';
    expect(moneyWithCommas(sample)).toBe('58,957,447');
    expect(moneyWithCommas(sample)).not.toBe(sample);
  });

  it('does not add commas after decimal', () => {
    const sample = '5474.2055';
    expect(moneyWithCommas(sample)).toBe('5,474.2055');
    expect(moneyWithCommas(sample)).not.toBe('5,474,.2,055');
  });

  it('return a string', () => {
    const sample = 55.57485;
    const format = moneyWithCommas(sample);
    expect(typeof format).toBe('string');
    expect(typeof format).not.toBe('number');
  });
});

describe('turning decimals to whole numbers', () => {
  it('turn decimal number to a whole number', () => {
    const sample = '575.74';
    expect(toDecimal(sample)).toBe('576');
    expect(toDecimal(sample)).not.toBe(sample);
  });

  it('return a string', () => {
    const sample = 55.27485;
    const format = toDecimal(sample);
    expect(typeof format).toBe('string');
    expect(toDecimal(sample)).toBe('55');
    expect(typeof format).not.toBe('number');
  });
});
