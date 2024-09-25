import app from "../server";
import * as db from "./db";
import supertest from "supertest";
const request = supertest(app);

// Connect to DB and test /api/
describe("Connect DB", () => {
  beforeAll(async () => {
    await db.connect();
  });

  test("GET - /api/", async () => {
    const res = await request.get("/api/").send();
    const body = res.body;
    const message = body.message;
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello from question service!");
  });
});

// Test /api/create
describe("Test Question API", () => {
  // Valid create
  test("POST /api/create - should create a new question", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "This is a sample question",
      category: "General",
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Question created successfully");
    expect(res.body.question).toHaveProperty("title", "Sample Question");
    expect(res.body.question).toHaveProperty(
      "description",
      "This is a sample question"
    );
    expect(res.body.question).toHaveProperty("category", "General");
    expect(res.body.question).toHaveProperty("complexity", "Easy");
  });

  // Empty title
  test("POST /api/create - empty title", async () => {
    const newQuestion = {
      title: "",
      description: "This is a sample question",
      category: "General",
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
    expect(res.body.errors[0].path).toBe("title");
  });

  // Empty description
  test("POST /api/create - empty description", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "",
      category: "General",
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
    expect(res.body.errors[0].path).toBe("description");
  });

  // Empty category
  test("POST /api/create - empty category", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "This is a sample question",
      category: "",
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
    expect(res.body.errors[0].path).toBe("category");
  });

  // Empty complexity
  test("POST /api/create - empty complexity", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "This is a sample question",
      category: "General",
      complexity: "",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
    expect(res.body.errors[0].path).toBe("complexity");
  });
});

// Test /api/all
describe("Test Get All", () => {
  // Get all with questions
  test("GET /api/all - should retrieve all questions", async () => {
    const res = await request.get("/api/all").send();
    const sampleQuestion = res.body[0];
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(sampleQuestion).toHaveProperty("title", "Sample Question");
    expect(sampleQuestion).toHaveProperty(
      "description",
      "This is a sample question"
    );
    expect(sampleQuestion).toHaveProperty("category", "General");
    expect(sampleQuestion).toHaveProperty("complexity", "Easy");
  });
});

// Test /api/{id}
describe("Test Get by Id", () => {
  // Valid id
  test("GET /api/:id - valid id", async () => {
    const questionId = 1090; // We start with id 1090
    const res = await request.get(`/api/${questionId}`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("questionid", questionId);
    expect(res.body).toHaveProperty("title", "Sample Question");
    expect(res.body).toHaveProperty("description", "This is a sample question");
    expect(res.body).toHaveProperty("category", "General");
    expect(res.body).toHaveProperty("complexity", "Easy");
  });

  // Negative id
  test("GET /api/:id - negative id", async () => {
    const questionId = -1;
    const res = await request.get(`/api/${questionId}`).send();
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
  });

  // Non-existent id
  test("GET /api/:id - non existent id", async () => {
    const questionId = 999999;
    const res = await request.get(`/api/${questionId}`).send();
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Question not found");
  });
});

// Test /api/{id}/update
describe("Test Update", () => {
  // Valid update
  test("POST - valid update", async () => {
    const updateQuestion = {
      title: "Update Title",
      description: "Update Description",
      category: "Update Category",
      complexity: "Update Complexity",
    };
    const questionId = 1090;
    const res = await request
      .post(`/api/${questionId}/update`)
      .send(updateQuestion);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("questionid", questionId);
  });

  // Empty update
  test("POST - empty update", async () => {
    const updateQuestion = {
      title: "",
      description: "",
      category: "",
      complexity: "",
    };
    const questionId = 1090;
    const res = await request
      .post(`/api/${questionId}/update`)
      .send(updateQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("At least one field must be provided");
  });

  // Non-existent id
  test("POST - non-existent id update", async () => {
    const updateQuestion = {
      title: "Update Title",
      description: "Update Description",
      category: "Update Category",
      complexity: "Update Complexity",
    };
    const questionId = 999999;
    const res = await request
      .post(`/api/${questionId}/update`)
      .send(updateQuestion);
    expect(res.statusCode).toBe(404);
    expect(res.body).toBe("Document not found");
  });
});

// Test /api/{id}/delete
describe("Test Delete", () => {
  afterAll(async () => {
    await db.clearDatabase();
    await db.closeDatabase();
  });

  // Valid delete
  test("POST - valid delete", async () => {
    const questionId = 1090;
    const res = await request.post(`/api/${questionId}/delete`).send();
    expect(res.statusCode).toBe(200);
  });

  // Negative id
  test("POST - negative id delete", async () => {
    const questionId = -1;
    const res = await request.post(`/api/${questionId}/delete`).send();
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
  });

  // Non-existent id
  test("POST - non-existent id delete", async () => {
    const questionId = 999999;
    const res = await request.post(`/api/${questionId}/delete`).send();
    expect(res.statusCode).toBe(404);
    expect(res.body).toBe("Document not found");
  });
});
