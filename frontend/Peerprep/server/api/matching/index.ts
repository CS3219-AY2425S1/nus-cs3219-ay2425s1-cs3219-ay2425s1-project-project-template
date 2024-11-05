export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const runtimeConfig = useRuntimeConfig(event);
  const matchingService = runtimeConfig.matchingService;
  try {
    const response = await $fetch(`${matchingService}/matching`, {
      method: "POST",
      body: body,
      headers: {
        Authorization: getHeader(event, "authorization") || "",
      },
    });

    return response;
  } catch (error) {
    console.error("Error during matching service request:", error);

    return {
      statusCode: 500,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});
