// @ts-nocheck

const kFormatter = (num: number) => {
  return Math.abs(num) > 9999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "K"
    : (Math.sign(num) * Math.abs(num)).toLocaleString();
};

export { kFormatter };
