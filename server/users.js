let users = [];

const addUser = (userName, userId, room) => {
  const userInfo = {
    userName,
    userId,
    rooms: [{ name: room.name, id: room.id }],
  };
  users.push(userInfo);
};
const removeUser = () => {};
const findUser = (id) => {
  const user = users.find((user) => user.userId === id);
  return user;
};

module.exports = { users, addUser, removeUser, findUser };
