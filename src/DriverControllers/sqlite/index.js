const os = require('os');

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

        let collectionData = this._formatSchema(rows);

        resolve(collectionData);
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
   * @param {Query} query - Query to convert to SQL
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

  /**
   *
   * @param {Object} schemaOutput - Output of the getSchemaFunction
   */
  _formatSchema(schemaOutput) {
    let formattedOutput = [];

    schemaOutput.forEach((elOut) => {
      let splitTableData = elOut.sql.split(os.EOL);

      let tableData = [];
      splitTableData.forEach((row) => {
        if (row.trim()[0] === '[' || row.trim().includes('FOREIGN KEY')) {
          tableData.push(this._parseLine(row.trim()));
        }
      });

      formattedOutput.push({
        tableName: elOut.name,
        schema: tableData,
      });
    });

    return formattedOutput;
  }

  _parseLine(lineToParse) {
    let trimmedLine = lineToParse.substring(0, lineToParse.length - 1);

    let splitLine = trimmedLine.split(' ');

    let filteredSplitLine = splitLine.filter((element) => element !== '');

    let name, type, modifiers;

    if (filteredSplitLine[0][0] === '[') {
      name = filteredSplitLine[0].replace('[', '').replace(']', '');
      type = filteredSplitLine[1];
      modifiers = filteredSplitLine.slice(2);
    } else if (filteredSplitLine[0] === 'FOREIGN') {
      name = filteredSplitLine[0];
      type = filteredSplitLine[1];
      // modifiers = [
      //   ...filteredSplitLine.slice(0, 1),
      //   ...filteredSplitLine.slice(4),
      // ];
      modifiers = filteredSplitLine.slice(2);
    }

    let parsedData = {
      name,
      type,
      modifiers,
    };

    return parsedData;
  }
}

module.exports = DriverController;
