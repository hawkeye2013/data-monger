class DriverController {
  constructor(sqlite, driverConstructor) {
    this.db = new sqlite.Database(driverConstructor);
  }

  /**
   *
   * @param {Query} query - Query to find Resource
   */
  findOne(targetCollection, query) {
    return new Promise((resolve, reject) => {
      let queryData = this._convertQueryToSQL(query);

      let execQuery = `SELECT * FROM ${targetCollection} WHERE ${queryData.queryString} LIMIT 1;`;

      this.db.get(execQuery, queryData.queryMap, (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        resolve(rows);
      });
    });
  }

  /**
   *
   * @param {Query} query - Query to find Resource
   */
  find(targetCollection, query) {
    return new Promise((resolve, reject) => {
      let queryData = this._convertQueryToSQL(query);

      let execQuery = `SELECT * FROM ${targetCollection} WHERE ${queryData.queryString};`;

      this.db.all(execQuery, queryData.queryMap, (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        resolve(rows);
      });
    });
  }

  getSchema(targetCollection) {
    return new Promise((resolve, reject) => {
      let execQuery;
      let queryParams;

      if (targetCollection === '*') {
        execQuery = `SELECT * FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';`;
        queryParams = [];
      } else {
        execQuery = `SELECT * FROM sqlite_master WHERE type ='table' AND name = $1 AND name NOT LIKE 'sqlite_%';`;
        queryParams = [targetCollection];
      }

      this.db.all(execQuery, queryParams, (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        resolve(rows);
      });
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

  /**
   *
   * @param {Query} query Query to convert to SQL
   */
  _convertQueryToSQL(query) {
    let queryString = '';
    let queryMap = {};

    let keyCount = 0;

    query.query.forEach((element, index) => {
      if (index > 0) {
        queryString += ' AND ';
      }

      queryString += `${element.name}`;

      if (element.operator == '==') {
        queryString += ' = ';
      }

      queryString += `$${element.name}`;

      queryMap[`$${element.name}`] = element.value;
    });

    return { queryString, queryMap };
  }
}

module.exports = DriverController;
