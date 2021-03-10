class NumberUtils {
  static roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }
  static roundToFour(num) {
    return +(Math.round(num + "e+4") + "e-4");
  }
}
export default NumberUtils;
