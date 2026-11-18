import {enablePromise, openDatabase} from 'react-native-sqlite-storage';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase(
    // Name of the local database, kept from the first builds of the DRC application
    {name: 'v2_coachdb_cd', location: 'default'},
    () => console.log('Database connected!'),
    err => console.log('err! ', err),
  );
};
