class Collection {
  constructor(driverController, targetCollection) {
    this.driverController = driverController;
    this.targetCollection = targetCollection;
  }

  /**
   *
   * @param {Query} query - Query to find Resource
   */
  findOne(query) {
    return new Promise((resolve, reject) => {
      this.driverController
        .findOne(this.targetCollection, query)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => reject(err));
    });
  }

  /**
   *
   * @param {Query} query - Query to find Resource
   */
  find(query) {
    return new Promise((resolve, reject) => {
      this.driverController
        .find(this.targetCollection, query)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => reject(err));
    });
  }

  /**
   *
   */
  getSchema() {
    return new Promise((resolve, reject) => {
      this.driverController
        .getSchema(this.targetCollection)
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }

  /**
   *
   * @param {Resource} resource - Resource to create or update in DB
   */
  setOne(resource) {}

  /**
   *
   * @param {Resource[]} resource - Array of resources to create or update in DB
   */
  set(resource) {}
}

module.exports = Collection;
