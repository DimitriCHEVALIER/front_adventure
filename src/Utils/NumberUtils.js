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
}
export default NumberUtils;
