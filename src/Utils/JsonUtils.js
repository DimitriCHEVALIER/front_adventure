import cloneDeep from "lodash/cloneDeep";

class JsonUtils {
  static clone(json) {
    return cloneDeep(json);
  }
}

export default JsonUtils;
