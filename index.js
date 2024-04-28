const redis = require("async-redis");
const { GenericContainer } = require("testcontainers");

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


const runner = async (id) => {
  let container;
  let redisClient;

  container = await new GenericContainer("redis")
    .withExposedPorts(6379)
    .start();

  redisClient = redis.createClient(
    container.getMappedPort(6379),
    container.getHost())


  await redisClient.set("key", "val");
  const key = await redisClient.get("key");
  console.log(`before delay ${key}`);
  await delay(3000);
  console.log(`after delay ${key}`);
  await redisClient.quit();
  await container.stop();
}


Promise.all([runner(1), runner(2), runner(3)])