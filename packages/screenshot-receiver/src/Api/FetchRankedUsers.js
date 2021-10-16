const { axios } = require('../Config/Config');

const FetchUsers = async () => {
  try {
    const response = await axios.get('/');
    const Users = response.data.data;
    return Users;
  } catch (error) {
    console.error(
      `There was a problem retrieving user information from Wakatime Api`,
      error
    );
  }
};

module.exports = FetchUsers;
