import dbQuery from './db_query';

class Neighborhood {
  async getAllNeighborhoods() {
    const GET_ALL_NEIGHBORHOODS = 'SELECT * FROM neighborhoods';
    let result = await dbQuery(GET_ALL_NEIGHBORHOODS);

    return result;
  }

  // async getAllUsers() {
  //   const GET_USERS = 'SELECT * FROM users';
  //   let result = await dbQuery(GET_USERS);
  //   return result;
  // }
}

let neighborhood = new Neighborhood();
neighborhood.getAllNeighborhoods().then(res => console.log(res.rows));

export default Neighborhood;