import Queue from "bull";

// Initialize the Bull queue with Redis connection
const matchingQueue = new Queue("matching", "redis://127.0.0.1:6379");

// Process the queue
matchingQueue.process(async (job) => {
  console.log("Processing job:", job.data);

  // Simulate a processing delay (for testing purposes)
  await new Promise(resolve => setTimeout(resolve, 10000));

  try {
    // Get the current waiting jobs in the queue
    const waitingJobs = await matchingQueue.getActive();
    console.log("Waiting jobs:", waitingJobs.map(j => j.data));

    // Check if there are enough jobs to match (at least 2)
    if (waitingJobs.length >= 2) {
      const job1 = waitingJobs[0];
      const job2 = waitingJobs[1];

      // Log matched users (or any meaningful data)
      console.log(`Matched users: ${job1.data.username} and ${job2.data.username}`);

      // Mark both jobs as completed
      await job1.moveToCompleted(); // Better to call moveToCompleted on the job object directly
      await job2.moveToCompleted(); // This is cleaner and more efficient

      // Return a success message (this is optional)
      return `Matched: ${job1.id} and ${job2.id}`;
    } else {
      console.log("Not enough users in the waiting queue to match.");
      return "Not enough users to match.";
    }
  } catch (error) {
    console.error("Error processing job:", job.id, error);
    throw error; // Ensure errors are propagated to be handled by Bull
  }
});

export { matchingQueue };
