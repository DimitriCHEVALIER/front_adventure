class FilesMapper {
  /** Avec le un tableau simple, création d'un tableau d'objets adapté à la data-table */
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
