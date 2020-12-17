const Collection = require('./Collection');
class DataMonger {
  constructor(constructorData) {
    this.options = constructorData.options;

    this._loadDriver(constructorData);
  }

  collection(targetCollection) {
    return new Collection(this.driverController, targetCollection);
  }

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
        DriverController = require('./DriverControllers/sqlite');
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
