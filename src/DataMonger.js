const Collection = require('./Collection');
class DataMonger {
  constructor(constructorData) {
    this.options = constructorData.options;

    this._loadDriver(constructorData);
  }

  /**
   * Selects a collection to query (or table)
   * @param {String} targetCollection - Name of collection to query
   * @returns {Collection}
   */
  collection(targetCollection) {
    return new Collection(this.driverController, targetCollection);
  }

  getSchema() {
    return new Promise((resolve, reject) => {
      new Collection(this.driverController, '*')
        .getSchema('*')
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }

  /**
   * Alias to collection()
   * @param {String} targetCollection - Name of collection to query
   * @returns {Collection}
   */
  table(targetCollection) {
    return new Collection(this.driverController, targetCollection);
  }

  /**
   * Executes raw sql query
   * @param {RawQuery} query - SQL query to execute
   */
  raw(query) {}

  _loadDriver(constructorData) {
    let DriverController;
    switch (constructorData.dbType) {
      case 'PostgreSQL':
        DriverController = require('./DriverControllers/postgres');
        break;

      case 'MongoDB':
        DriverController = require('./DriverControllers/mongodb');
        break;

      case 'SQLite':
        DriverController = require('./DriverControllers/sqlite');
        break;

      case 'MySQL':
        DriverController = require('./DriverControllers/mysql');
        break;

      default:
        console.log(
          `dbType ${constructorData.dbType} not supported.  Create an issue here: https://github.com/hawkeye2013/data-monger/issues/new`
        );
        break;
    }

    this.driverController = new DriverController(
      constructorData.driver,
      constructorData.driverConstructor
    );
  }
}

module.exports = DataMonger;
