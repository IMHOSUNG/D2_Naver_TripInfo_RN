import faker from 'faker';

export const randomUsers = (count = 3) => {
  const arr = [];
  for (let i = 0; i < count; i ++) {
    arr.push({
      key: faker.random.uuid(),
      name: faker.name.firstName(),
      avatar: faker.image.nature(),
    });
  }

  return arr;
};