class NumberUtils {
  static roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }
  static roundToFour(num) {
    return +(Math.round(num + "e+4") + "e-4");
  }

  static getSumFromArray(array, property) {
    return array
      .map(c =>
        !Number.isNaN(Number.parseInt(c[property]))
          ? Number.parseInt(c[property])
          : 0
      )
      .reduce((sum, x) => sum + x);
  }

  static randomRgba() {
    var o = Math.round,
      r = Math.random,
      s = 255;
    return (
      "rgba(" +
      o(r() * s) +
      "," +
      o(r() * s) +
      "," +
      o(r() * s) +
      "," +
      r().toFixed(1) +
      ")"
    );
  }

  static getColor(value, positiveSensibility = 400, negativeSensibility = 80) {
    if (value > 0) {
      const colorGreenPonderee =
        value > positiveSensibility
          ? 255
          : (value / positiveSensibility) * 150 + 105;
      return "rgb(0, " + colorGreenPonderee + ", 0)";
    }
    const colorRedPonderee =
      255 -
      (value * -1 > negativeSensibility
        ? 255
        : (value / negativeSensibility) * 150 + 105);
    return "rgb(" + colorRedPonderee + ",50, 0)";
  }
}
export default NumberUtils;
