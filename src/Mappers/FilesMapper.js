class FilesMapper {
  static map(array) {
    let mappedArray = [];
    for (const value of array) {
      mappedArray.push({
        name: value
      });
    }
    return mappedArray;
  }
}

export default FilesMapper;
