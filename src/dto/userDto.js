const userDto = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles,
  };
};

module.exports = userDto;
