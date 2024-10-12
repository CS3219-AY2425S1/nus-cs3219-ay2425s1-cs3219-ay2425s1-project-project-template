import Queue from "bull";

const matchingQueue = new Queue("matching", "redis://127.0.0.1:6379");

matchingQueue.process(async (job) => {
  console.log("processing");
  const waiting_users = await matchingQueue.getJobs(["waiting"]);
  if (waiting_users.length >= 2) {
    // Get the first two users from the queue
    const job1 = waiting_users[0]; // First user in the queue
    const job2 = waiting_users[1]; // Second user in the queue

    // Mark both jobs as completed (they are matched)
    await job1.moveToCompleted();
    await job2.moveToCompleted();

    console.log(`Matched users: ${job1.id} and ${job2.id}`);
  } else {
    matchingQueue.add(job, { lifo: true });
  }
});

export { matchingQueue };
