let users = [];

const addUser = (userName, userId, roomName) => {
  const userInfo = {
    userName,
    userId,
    rooms: [roomName],
  };
  users.push(userInfo);
};
const removeUser = () => {};
const findUser = (id) => {
  const user = users.find((user) => user.userId === id);
  return user;
};

module.exports = { users, addUser, removeUser, findUser };
